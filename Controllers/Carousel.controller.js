// controllers/carousel.controller.js
import {
  getAllCarouselImages,
  addCarouselImageService,
  addMultipleCarouselImagesService,
  getCarouselImageById,
  updateCarouselImage,
  deleteCarouselImage,
} from "../Services/Carousel.service.js";

/**
 * Controller expects multer memory middleware applied on routes:
 * - single upload: uploadMemory.single('image') -> req.file
 * - multiple upload: uploadMemory.array('images') -> req.files
 */

/* GET /api/carousel */
export const getCarouselImages = async (req, res) => {
  try {
    const images = await getAllCarouselImages();
    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error("getCarouselImages error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* POST /api/carousel  (single) */
export const addCarouselImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image file required (field 'image')" });

    const redirectUrl = req.body.redirectUrl || "";
    const created = await addCarouselImageService({
      fileBuffer: req.file.buffer,
      originalName: req.file.originalname,
      redirectUrl,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("addCarouselImage error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* POST /api/carousel/multiple  (multiple) */
export const addMultipleCarouselImages = async (req, res) => {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ success: false, message: "Image files required (field 'images')" });

    // redirectUrls can be sent as JSON string in body.redirectUrls
    let redirectUrls = [];
    if (req.body.redirectUrls) {
      try {
        redirectUrls = JSON.parse(req.body.redirectUrls);
      } catch (e) {
        // fallback: ignore parse and use empty array
        redirectUrls = [];
      }
    }

    const created = await addMultipleCarouselImagesService(req.files, redirectUrls);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("addMultipleCarouselImages error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* GET /api/carousel/:id */
export const getCarouselImage = async (req, res) => {
  try {
    const item = await getCarouselImageById(req.params.id);
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("getCarouselImage error:", error);
    return res.status(404).json({ success: false, message: error.message });
  }
};

/* PUT /api/carousel/:id  (optional file) */

export const updateCarouselImageController = async (req, res) => {
  try {
    const id = req.params.id;

    // DEBUG logs (temporary — remove in production)
    console.log("=== updateCarouselImageController called ===");
    console.log("Headers content-type:", req.headers["content-type"]);
    console.log("req.file exists:", !!req.file);
    console.log("req.body:", req.body);

    // Defensive: ensure req.body is an object
    const body = req.body || {};

    // Extract redirectUrl safely (could be undefined)
    let redirectUrl;
    if (typeof body.redirectUrl !== "undefined") {
      // If multer parsed fields, redirectUrl will be string
      redirectUrl = body.redirectUrl === "" ? "" : String(body.redirectUrl);
    } else {
      redirectUrl = undefined; // means "don't change" if you want that behavior
    }

    // If no file, update only redirectUrl (or other non-file fields)
    if (!req.file) {
      const updated = await svcUpdate(id, { redirectUrl });
      return res.status(200).json({ success: true, carousel: updated });
    }

    // If file present -> upload and update
    const original = req.file.originalname || `carousel-${Date.now()}`;
    const ext = path.extname(original);
    const name = path.basename(original, ext).replace(/\s+/g, "-").toLowerCase();
    const publicId = `${name}-${Date.now()}`;

    const result = await uploadToCloudinary(req.file.buffer, "carousel", publicId);

    const updated = await svcUpdate(id, {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      redirectUrl,
    });

    return res.json({ success: true, carousel: updated });
  } catch (err) {
    console.error("updateCarouselImageController error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/* DELETE /api/carousel/:id */
export const deleteCarouselImageController = async (req, res) => {
  try {
    const deleted = await deleteCarouselImage(req.params.id);
    return res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error("deleteCarouselImageController error:", error);
    return res.status(404).json({ success: false, message: error.message });
  }
};
