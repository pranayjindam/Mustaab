// routes/carousel.routes.js
import express from "express";
import {
  getCarouselImages,
  addCarouselImage,
  addMultipleCarouselImages,
  getCarouselImage,
  updateCarouselImageController,
  deleteCarouselImageController,
} from "../Controllers/Carousel.controller.js";
import { AuthenticateAdmin } from "../Middlewares/auth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Public: get all carousel items
router.get("/", getCarouselImages);

// Public: get single carousel item
router.get("/:id", getCarouselImage);

// Admin: add single carousel image (field name: 'image')
router.post(
  "/",
  AuthenticateAdmin,
  upload.single("image"), // expects field 'image'
  addCarouselImage
);

// Admin: add multiple carousel images (field name: 'images')
// Optionally send redirectUrls as JSON string in body.redirectUrls (e.g. '["/p/1","/p/2"]')
router.post(
  "/multiple",
  AuthenticateAdmin,
  upload.array("images", 20), // up to 20 files
  addMultipleCarouselImages
);

// Admin: update carousel item (optional new file in field 'image')
router.put(
  "/:id",
  AuthenticateAdmin,
  upload.single("image"), // if a new image is sent it'll replace the old one
  updateCarouselImageController
);

// Admin: delete carousel item
router.delete("/:id", AuthenticateAdmin, deleteCarouselImageController);

export default router;
