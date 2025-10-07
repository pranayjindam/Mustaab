import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ["main", "sub", "type"], required: true },
    parent: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // for sub & type
    ],
    tags: [String],
    description: String,
    image: String,
  },
  { timestamps: true }
);

// Remove old indexes if needed
// db.categories.dropIndex("name_1_level_1_parent_1")

// ✅ Compound unique index per name + level + parent combination
categorySchema.index(
  { name: 1, level: 1, parent: 1 },
  {
    unique: true,
    partialFilterExpression: { parent: { $exists: true } } // only enforce when parent exists
  }
);

export const Category = mongoose.model("Category", categorySchema);
