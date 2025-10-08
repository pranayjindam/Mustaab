import Review from "../Models/Review.model.js";
import {Product} from "../Models/Product.model.js";
import mongoose from "mongoose";
import UserModel from "../Models/User.model.js";
export const createReview = async ({ productId, rating, review }, user) => {
  const newReview = await Review.create({
    product: productId,
    user: user._id,
    rating,
    review,
  });
  return newReview;
};



export const getAllReview = async (productId, { sort = "date", page = 1, limit = 10 }) => {
  const query = { product: productId, isHidden: false };

  const sortObj = {
    date: { createdAt: -1 },
    rating: { rating: -1 },
  };

  let reviews = await Review.find(query)
    .populate({ path: "user", select: "name email" })
    .sort(sortObj[sort])
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Replace null users with placeholder
  reviews = reviews.map(r => {
    if (!r.user) r.user = { name: "Deleted User", email: "" };
    return r;
  });

  const total = await Review.countDocuments(query);

  return {
    success: true,
    count: reviews.length,
    total,
    reviews,
  };
};



export const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) throw new Error("Review not found or not yours");

  review.rating = updateData.rating || review.rating;
  review.review = updateData.review || review.review;
  return await review.save();
};

export const deleteReview = async (reviewId, userId) => {
  const result = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!result) throw new Error("Review not found or not yours");
  return result;
};

export const hideReview = async (reviewId, admin = false) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  review.isHidden = true;
  return await review.save();
};


// ✅ Admin: Get all reviews for all products
export const getAllReviewsAdmin = async () => {
  const reviews = await Review.find()
    .populate({ path: "user", select: "firstName lastName email" })
    .populate({ path: "product", select: "name" })
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: reviews.length,
    reviews,
  };
};
