import * as productService from "../Services/Product.service.js";


export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const addmultipleProducts=async(req,res)=>{
  try{
    const products=await productService.addMultipleProducts(req.body);
    res.status(201).json({success:true,products});
  }
  catch (err) {
    console.error("Error creating products:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const products = await productService.searchProducts(req.params.keyword);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
