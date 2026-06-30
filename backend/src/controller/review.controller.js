import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";

// Create a review for a product
export const createReview = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const { rating, comment, isVerifiedBuyer } = req.body;
    
    const review = await Review.create({
        productId,
        buyerId: req.user._id,
        rating: Number(rating),
        comment,
        isVerifiedBuyer: isVerifiedBuyer === true
    });

    // Populate buyer info before returning
    await review.populate("buyerId", "fullName");

    res.status(201).json({ success: true, review });
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Access control: only creator of the review can delete it
    if (review.buyerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
});

// Get all reviews for a product
export const getProductReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
        .populate("buyerId", "fullName")
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
});