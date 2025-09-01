import mongoose from "mongoose";

const recentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Recent", recentSchema);
