import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/review`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const createReviewAPI = async (productId, reviewData) => {
    const response = await api.post(`/${productId}/create`, reviewData);
    return response.data;
};

export const getProductReviewsAPI = async (productId) => {
    const response = await api.get(`/${productId}`);
    return response.data;
};

export const deleteReviewAPI = async (productId, reviewId) => {
    const response = await api.delete(`/${productId}/delete/${reviewId}`);
    return response.data;
};
