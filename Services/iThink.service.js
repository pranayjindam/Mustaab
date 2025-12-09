// server/Services/iThink.service.js
import 'dotenv/config';
import https from 'https';
import { URL, URLSearchParams } from 'url';
import fs from 'fs';
import path from 'path';

const BASE_URL = (process.env.ITHINK_BASE_URL || 'https://api.ithinklogistics.com/api_v3').replace(/\/$/, '');
const ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN || '';
const SECRET_KEY = process.env.ITHINK_SECRET_KEY || '';

const DBG_DIR = path.resolve(process.cwd(), 'debug_ithink');
if (!fs.existsSync(DBG_DIR)) fs.mkdirSync(DBG_DIR, { recursive: true });

const safeStringify = (o) => {
  try { return JSON.stringify(o); } catch (e) { return String(o); }
};

const mask = (s) => {
  if (!s || typeof s !== 'string') return s;
  if (s.length <= 8) return '*'.repeat(s.length);
  return `${s.slice(0,4)}${'*'.repeat(Math.max(0, s.length-8))}${s.slice(-4)}`;
};

const dump = (name, obj) => {
  try {
    const fname = path.join(DBG_DIR, `${name.replace(/[^\w.-]/g,'_')}_${Date.now()}.json`);
    fs.writeFileSync(fname, safeStringify(obj), 'utf8');
    return fname;
  } catch (e) {
    console.warn('iThink dump failed', e?.message || e);
    return null;
  }
};

console.log('iThinkService init ->', { BASE_URL, ACCESS_TOKEN_present: !!ACCESS_TOKEN, SECRET_present: !!SECRET_KEY, debug_dir: DBG_DIR });

const postHttps = (urlStr, bodyString, contentType = 'application/json') =>
  new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(urlStr);
      const opts = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + (urlObj.search || ''),
        method: 'POST',
        headers: { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(bodyString) },
      };
      const req = https.request(opts, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          // attempt JSON parse
          try {
            const json = JSON.parse(data);
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: json, raw: data, headers: res.headers });
          } catch (e) {
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      });
      req.on('error', (err) => reject(err));
      req.write(bodyString);
      req.end();
    } catch (err) {
      reject(err);
    }
  });

/**
 * JSON POST wrapper (primary)
 */
const postJson = async (path, body = {}, timeoutMs = 15000) => {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const payload = { ...body, access_token: ACCESS_TOKEN, secret_key: SECRET_KEY };

  // console summary with masked secrets
  const masked = JSON.parse(safeStringify(payload));
  if (masked.access_token) masked.access_token = mask(masked.access_token);
  if (masked.secret_key) masked.secret_key = mask(masked.secret_key);

  console.log('\n[iThink] POST JSON ->', url);
  console.log('[iThink] payload summary (masked):', safeStringify(masked).slice(0, 3000));

  try {
    const resp = await postHttps(url, JSON.stringify(payload), 'application/json');
    console.log('[iThink] POST JSON response status=', resp.status);
    // dump resp and request for debugging if not ok or body says error
    const bodyStatus = resp?.data?.status ?? (resp.ok ? 'ok' : 'error');
    if (!resp.ok || String(bodyStatus).toLowerCase() === 'error') {
      const dumpPath = dump('ithink_json_fail', { url, request: masked, response: resp });
      console.warn('[iThink] JSON request failed or returned business error. Dumped ->', dumpPath);
    } else {
      console.log('[iThink] JSON success body:', resp.data);
    }
    return resp;
  } catch (err) {
    const dumpPath = dump('ithink_json_exception', { url, request: masked, error: String(err) });
    console.error('[iThink] JSON request exception ->', String(err), 'dumped ->', dumpPath);
    return { ok: false, status: 0, error: String(err) };
  }
};

/**
 * Form wrapper POST: many iThink accounts expect `data=<json-string>` (fallback)
 */
const postFormWrapper = async (path, body = {}, timeoutMs = 20000) => {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const payload = { ...body, access_token: ACCESS_TOKEN, secret_key: SECRET_KEY };
  const dataStr = safeStringify(payload);
  const form = new URLSearchParams();
  form.append('data', dataStr);

  // masked preview
  let masked = {};
  try {
    masked = JSON.parse(dataStr);
    if (masked.access_token) masked.access_token = mask(masked.access_token);
    if (masked.secret_key) masked.secret_key = mask(masked.secret_key);
    if (masked.shipments && Array.isArray(masked.shipments)) masked.shipments = masked.shipments.slice(0,1);
  } catch (e) { masked = { length: dataStr.length }; }

  console.log('\n[iThink] POST FORM ->', url);
  console.log('[iThink] form payload summary (masked):', safeStringify(masked).slice(0, 3000), 'rawLen=', dataStr.length);

  try {
    const resp = await postHttps(url, form.toString(), 'application/x-www-form-urlencoded');
    console.log('[iThink] POST FORM response status=', resp.status);
    const bodyStatus = resp?.data?.status ?? (resp.ok ? 'ok' : 'error');
    if (!resp.ok || String(bodyStatus).toLowerCase() === 'error') {
      const dumpPath = dump('ithink_form_fail', { url, requestPreview: masked, response: resp });
      console.warn('[iThink] FORM request failed or returned business error. Dumped ->', dumpPath);
    } else {
      console.log('[iThink] FORM success body:', resp.data);
    }
    return resp;
  } catch (err) {
    const dumpPath = dump('ithink_form_exception', { url, requestPreview: masked, error: String(err) });
    console.error('[iThink] FORM request exception ->', String(err), 'dumped ->', dumpPath);
    return { ok: false, status: 0, error: String(err) };
  }
};

export const iThinkService = {
  // primary: JSON
  createOrderJson: async (payload) => postJson('/order/add.json', payload),
  // fallback: form wrapper
  createOrderForm: async (payload) => postFormWrapper('/order/add.json', payload),
  // tracking / other endpoints (JSON)
  trackOrder: async (payload) => postJson('/order/track.json', payload),
  cancelOrder: async (payload) => postJson('/order/cancel.json', payload),
  getLabel: async (payload) => postJson('/order/label.json', payload),
  raw: async (path, payload) => postJson(path, payload),
};

export default iThinkService;
