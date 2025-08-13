import express from "express";
import { addCarouselImage, getCarouselImages } from "../Controllers/Carousel.controller.js";

const carouselRouter = express.Router();

carouselRouter.post("/add", addCarouselImage);  // Add new carousel image
carouselRouter.get("/get", getCarouselImages);     // Get all carousel images

export default carouselRouter;
