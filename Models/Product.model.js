// models/Product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    category: {
      type: String,
      required: true,
      enum: [
        "womens-dresses",
        "womens-sarees",
        "beauty-items",
        "kids-wear",
        "hand-bags",
        "accessories",
        "womens-jewellery"
      ],
    },

    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },

    sizes: [String], // Optional
    colors: [
      {
        name: String,
        image: String, // Can be swatch/image
      }
    ],

    tags: [String],
    brand: String,
    sku: String,
    weight: Number,

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    warrantyInformation: String,
    shippingInformation: String,

    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited"],
      default: "In Stock",
    },

    reviews: [
      {
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
        reviewerName: String,
        reviewerEmail: String,
      },
    ],

    returnPolicy: String,
    minimumOrderQuantity: { type: Number, default: 1 },

    meta: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      barcode: String,
      qrCode: String,
    },

    images: [String],
    thumbnail: String,
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
export default mongoose.models.Product || mongoose.model("Product", productSchema);
