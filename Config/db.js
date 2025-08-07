import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGO_DB_URL;
  console.log("🔍 Connecting to MongoDB with URI:", uri);

  if (!uri) {
    console.error("❌ MONGO_DB_URL is undefined!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: "Mustaab",
    });
    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export { connectDb };
