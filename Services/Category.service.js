// services/categoryService.js
import { Category } from "../Models/Category.model.js";

// Get all categories
export const getAllCategoriesService = async () => {
  return await Category.find();
};

// Get category by ID
export const getCategoryByIdService = async (id) => {
  return await Category.findById(id);
};

// Create category
export const createCategoryService = async (data) => {
  const category = new Category(data);
  return await category.save();
};

// Update category
export const updateCategoryService = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// Delete category
export const deleteCategoryService = async (id) => {
  return await Category.findByIdAndDelete(id);
};
