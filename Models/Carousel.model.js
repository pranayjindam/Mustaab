import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  image: { type: String, required: true },  // Cloudinary secure URL
  path: { type: String, required: true },   // Cloudinary public_id
  redirectUrl: { type: String, default: "" },
}, { timestamps: true });

export const Carousel = mongoose.models.Carousel || mongoose.model("Carousel", carouselSchema);
