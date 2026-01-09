import { Category } from "../Models/Category.model.js";

export const createCategory = async (data) => {
  // normalize parent
  if (data.level === "main") {
    data.parent = [];
  } else {
    data.parent = Array.isArray(data.parent) ? data.parent : [data.parent];
  }

  // 🔴 DO NOT check existing for main categories
  if (data.level !== "main") {
    const existing = await Category.findOne({
      name: data.name,
      level: data.level,
      parent: { $size: data.parent.length, $all: data.parent }
    });

    if (existing) {
      throw new Error("Category already exists under selected parent");
    }
  }

  const category = new Category(data);
  return await category.save();
};




// Get all categories (with parent populated)
export const getAllCategories = async () => {
  return Category.find().populate("parent", "name level").sort({ level: 1, name: 1 });
};

// Get by Id
export const getCategoryById = async (id) => {
  return Category.findById(id).populate("parent", "name level");
};

// Update category
export const updateCategory = async (id, data) => {
  if (!data.parent) data.parent = [];
  return Category.findByIdAndUpdate(id, data, { new: true }).populate("parent", "name level");
};

// Delete category
export const deleteCategory = async (id) => {
  return Category.findByIdAndDelete(id);
};
