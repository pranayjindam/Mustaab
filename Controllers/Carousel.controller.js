import {
  getAllCarouselImages,
  addCarouselImageService,
  getCarouselImageById,
  updateCarouselImage,
  deleteCarouselImage
} from "../Services/Carousel.service.js";

// ✅ Get all carousel images
export const getCarouselImages = async (req, res) => {
  try {
    const images = await getAllCarouselImages();
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add new carousel image
export const addCarouselImage = async (req, res) => {
  try {
    const newImage = await addCarouselImageService(req.body);
    res.status(201).json({ success: true, data: newImage });
  } catch (error) {
    console.error("Error adding carousel image:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single carousel image by ID
export const getCarouselImage = async (req, res) => {
  try {
    const image = await getCarouselImageById(req.params.id);
    res.status(200).json({ success: true, data: image });
  } catch (error) {
    console.error("Error fetching carousel image:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Update carousel image
export const updateCarouselImageController = async (req, res) => {
  try {
    const updatedImage = await updateCarouselImage(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedImage });
  } catch (error) {
    console.error("Error updating carousel image:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Delete carousel image
export const deleteCarouselImageController = async (req, res) => {
  try {
    const deletedImage = await deleteCarouselImage(req.params.id);
    res.status(200).json({ success: true, data: deletedImage });
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};
