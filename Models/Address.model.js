import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: Number, required: true },
  phoneNumber: { type: String, required: true },

  isDefault: { type: Boolean, default: false }, // ✅ optional: default address flag

}, { timestamps: true }); // ✅ adds createdAt and updatedAt automatically

// Prevent Overwrite Model Error
export default mongoose.models.Address || mongoose.model("Address", addressSchema);
