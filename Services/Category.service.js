import { Category } from "../Models/Category.model.js";

export const createCategory = async (data) => {
  // Always store parent as array
  const parentArray = data.level === "main" ? [] : Array.isArray(data.parent) ? data.parent : [data.parent];
  data.parent = parentArray;

  // Allow same name under different parents
  const existing = await Category.findOne({
    name: data.name,
    level: data.level,
    parent: { $all: parentArray } // ensures exact parent(s) match
  });

  if (existing) {
    // already exists under same parent(s), return it
    return existing;
  }

  const category = new Category(data);
  return category.save();
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
