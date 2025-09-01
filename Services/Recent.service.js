import Recent from "../Models/Recent.model.js";

export const addRecentProduct = async (userId, productId) => {
  if (!productId) throw new Error("ProductId is required");

  let recent = await Recent.findOne({ user: userId });

  if (!recent) {
    recent = new Recent({ user: userId, products: [productId] });
  } else {
    // remove if already exists
    recent.products = recent.products.filter(
      (p) => p.toString() !== productId
    );
    // add to start
    recent.products.unshift(productId);

    if (recent.products.length > 10) {
      recent.products = recent.products.slice(0, 10);
    }
  }

  await recent.save();
  return recent.products;
};

export const getRecentProducts = async (userId, limit = 10) => {
  const recent = await Recent.findOne({ user: userId })
    .populate("products", "name title price images category rating") // add 'name', 'title', 'rating'
    .lean();

  return recent ? recent.products.slice(0, limit) : [];
};


export const clearRecentProducts = async (userId) => {
  await Recent.findOneAndUpdate(
    { user: userId },
    { $set: { products: [] } }
  );
  return true;
};
