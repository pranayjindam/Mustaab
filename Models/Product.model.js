import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    description: { type: String, text: true },

    category: {
      main: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      sub: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      type: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    },

    tags: [{ type: String, index: true }],
    sizes: [String],

    colors: [
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    image: String,
  },
],


    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },

    barcode: { type: Number, required: true },

    images: [String],
    thumbnail: String,

    isFeatured: { type: Boolean, default: false },
    isReturnable: { type: Boolean, default: false },
    isExchangeable: { type: Boolean, default: false },
    isCancelable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({
  title: "text",
  description: "text",
  "colors.name": "text",
  tags: "text",
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
