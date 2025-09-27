import Review from "../Models/Review.model.js";
import {Product} from "../Models/Product.model.js";
import mongoose from "mongoose";

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

  return await Review.find(query)
    .populate("user", "firstName lastName")
    .sort(sortObj[sort] || sortObj.date)
    .skip((page - 1) * limit)
    .limit(limit);
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
