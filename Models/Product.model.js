import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      main: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      sub: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      type: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    },
    tags: [String],
    sizes: [String],
    colors: [
      {
        name: String,
        image: String,
      },
    ],
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    images: [String],
    thumbnail: String,
    isFeatured: { type: Boolean, default: false },
    isReturnable: { type: Boolean, default: false },
    isExchangeable: { type: Boolean, default: false },
    isCancelable: { type: Boolean, default: true },
   
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
