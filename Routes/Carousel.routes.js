import express from "express";
import {
  getCarouselImages,
  addCarouselImage,
  getCarouselImage,
  updateCarouselImageController,
  deleteCarouselImageController
} from "../Controllers/Carousel.controller.js";

const router = express.Router();

// Carousel CRUD routes
router.get("/", getCarouselImages); // Get all images
router.post("/", addCarouselImage); // Add new image
router.get("/:id", getCarouselImage); // Get single image
router.put("/:id", updateCarouselImageController); // Update image
router.delete("/:id", deleteCarouselImageController); // Delete image

export default router;
