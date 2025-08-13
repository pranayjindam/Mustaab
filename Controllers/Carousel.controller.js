import { Carousel } from "../Models/Carousel.model.js";

// Get carousel images
export const getCarouselImages = async (req, res) => {
  try {
    const images = await Carousel.find();
    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Add carousel image
export const addCarouselImage = async (req, res) => {
  try {
    const { image, path } = req.body;

    if (!image || !path) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newImage = await Carousel.create({ image, path });
    res.status(201).json({
      success: true,
      data: newImage
    });
  } catch (error) {
    console.error("Error adding carousel image:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
