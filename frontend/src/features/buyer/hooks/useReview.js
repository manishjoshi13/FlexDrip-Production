import { useState } from 'react';
import {
    createReviewAPI,
    getProductReviewsAPI,
    deleteReviewAPI
} from '../services/reviewApi.service';

export const useReview = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    const getProductReviews = async (productId) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getProductReviewsAPI(productId);
            setReviews(result.reviews || []);
            return { success: true, reviews: result.reviews };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const createReview = async (productId, reviewData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createReviewAPI(productId, reviewData);
            setReviews(prev => [result.review, ...prev]);
            return { success: true, review: result.review };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (productId, reviewId) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteReviewAPI(productId, reviewId);
            setReviews(prev => prev.filter(r => r._id !== reviewId));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        reviews,
        getProductReviews,
        createReview,
        deleteReview
    };
};
