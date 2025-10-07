import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export const Carousel = mongoose.model("Carousel", carouselSchema);
