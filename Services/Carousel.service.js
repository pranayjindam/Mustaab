import { Carousel } from "../Models/Carousel.model.js";

// ✅ Get all carousel images
export const getAllCarouselImages = async () => {
  return await Carousel.find();
};

// ✅ Add a new carousel image
export const addCarouselImageService = async (data) => {
  const { image, path } = data;
  if (!image || !path) {
    throw new Error("All fields are required");
  }
  return await Carousel.create({ image, path });
};

// ✅ Get single carousel image by ID
export const getCarouselImageById = async (id) => {
  const carousel = await Carousel.findById(id);
  if (!carousel) throw new Error("Carousel image not found");
  return carousel;
};

// ✅ Update carousel image
export const updateCarouselImage = async (id, data) => {
  const carousel = await Carousel.findByIdAndUpdate(id, data, { new: true });
  if (!carousel) throw new Error("Carousel image not found");
  return carousel;
};

// ✅ Delete carousel image
export const deleteCarouselImage = async (id) => {
  const carousel = await Carousel.findByIdAndDelete(id);
  if (!carousel) throw new Error("Carousel image not found");
  return carousel;
};
