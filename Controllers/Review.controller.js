import * as ReviewService from "../Services/Review.service.js";

export const createReview = async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.body, req.user);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const reviews = await ReviewService.getAllReview(req.params.productId, req.query);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updated = await ReviewService.updateReview(req.params.reviewId, req.user._id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const result = await ReviewService.deleteReview(req.params.reviewId, req.user._id);
    res.status(200).json({ message: "Deleted", result });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const hideReview = async (req, res) => {
  try {
    const hidden = await ReviewService.hideReview(req.params.reviewId);
    res.status(200).json(hidden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await ReviewService.getAllReviewsAdmin();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

