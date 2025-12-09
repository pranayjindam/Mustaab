// services/Carousel.service.js
import { Carousel } from "../Models/Carousel.model.js";
import cloudinary from "../Config/cloudinary.js";
import path from "path";

/**
 * Helper: upload a Buffer to Cloudinary using upload_stream
 * returns: { secure_url, public_id, ... }
 */
const uploadToCloudinary = (fileBuffer, folder = "carousel", publicIdBase = `carousel-${Date.now()}`) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicIdBase,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Basic sanitization for redirect URLs
 * Allow absolute http(s) URLs or internal paths starting with '/'
 */
const sanitizeRedirectUrl = (raw) => {
  if (!raw) return "";
  const str = String(raw).trim();
  if (/^https?:\/\//i.test(str) || /^\//.test(str)) return str;
  return "";
};

/* ===========================
   Service functions
   =========================== */

export const addCarouselImageService = async ({ fileBuffer, originalName, redirectUrl }) => {
  if (!fileBuffer) throw new Error("File buffer is required");

  const ext = path.extname(originalName || "");
  const name = (path.basename(originalName || "carousel", ext) || "carousel")
    .replace(/\s+/g, "-")
    .toLowerCase();
  const publicId = `${name}-${Date.now()}`;

  // upload to cloudinary
  const uploaded = await uploadToCloudinary(fileBuffer, "carousel", publicId);

  const created = await Carousel.create({
    image: uploaded.secure_url,
    path: uploaded.public_id,
    redirectUrl: sanitizeRedirectUrl(redirectUrl),
  });

  return created;
};

export const addMultipleCarouselImagesService = async (files = [], redirectUrls = []) => {
  if (!Array.isArray(files) || files.length === 0) throw new Error("Files are required");

  const created = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const redirect = redirectUrls && redirectUrls[i] ? redirectUrls[i] : "";
    const originalName = file.originalname || `carousel-${i}-${Date.now()}`;

    const saved = await addCarouselImageService({
      fileBuffer: file.buffer,
      originalName,
      redirectUrl: redirect,
    });
    created.push(saved);
  }
  return created;
};

export const getAllCarouselImages = async () => {
  return await Carousel.find().sort({ createdAt: -1 });
};

export const getCarouselImageById = async (id) => {
  const item = await Carousel.findById(id);
  if (!item) throw new Error("Carousel image not found");
  return item;
};

/**
 * Update carousel item:
 * - if fileBuffer + originalName provided => upload new image, delete old cloudinary image, update image/path
 * - redirectUrl can be updated as well
 */
export const updateCarouselImage = async (id, { fileBuffer, originalName, redirectUrl } = {}) => {
  const item = await Carousel.findById(id);
  if (!item) throw new Error("Carousel image not found");

  // If new image is provided, upload and remove old one
  if (fileBuffer) {
    const ext = path.extname(originalName || "");
    const name = (path.basename(originalName || "carousel", ext) || "carousel")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const publicId = `${name}-${Date.now()}`;

    const uploaded = await uploadToCloudinary(fileBuffer, "carousel", publicId);

    // Attempt to delete old image (best-effort)
    try {
      if (item.path) await cloudinary.uploader.destroy(item.path);
    } catch (e) {
      console.warn("Warning: failed to delete previous cloudinary image:", e?.message || e);
    }

    item.image = uploaded.secure_url;
    item.path = uploaded.public_id;
  }

  if (typeof redirectUrl !== "undefined") {
    item.redirectUrl = sanitizeRedirectUrl(redirectUrl);
  }

  await item.save();
  return item;
};

export const deleteCarouselImage = async (id) => {
  const item = await Carousel.findById(id);
  if (!item) throw new Error("Carousel image not found");

  // delete from cloudinary (best-effort)
  try {
    if (item.path) await cloudinary.uploader.destroy(item.path);
  } catch (e) {
    console.warn("Warning: failed to destroy cloudinary image:", e?.message || e);
  }

  await item.deleteOne();
  return item;
};
