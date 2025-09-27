import * as categoryService from "../Services/Category.service.js";

// Create
export const createCategory = async (req, res) => {
  try {
    const { name, level, parent, tags, description, image } = req.body;

    const category = await categoryService.createCategory({
      name,
      level,
      parent,
      tags,
      description,
      image
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};



// Update
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, category });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Get all
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by Id
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
