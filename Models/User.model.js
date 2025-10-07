import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  mobile: { type: String, unique: true, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }]
});

export default mongoose.models.User || mongoose.model('User', userSchema);

