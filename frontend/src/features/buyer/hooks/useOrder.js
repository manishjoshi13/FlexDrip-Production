import { useState } from 'react';
import {
    createOrderAPI,
    getMyOrdersAPI,
    getOrderByIdAPI,
    cancelOrderAPI,
    getSellerOrdersAPI,
    updateOrderStatusAPI
} from '../services/orderApi.service';

export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);

    const createOrder = async (orderData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createOrderAPI(orderData);
            return { success: true, order: result.order };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const getMyOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getMyOrdersAPI();
            setOrders(result.orders || []);
            return { success: true, orders: result.orders };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderById = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getOrderByIdAPI(id);
            setOrderDetails(result.order);
            return { success: true, order: result.order };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const cancelOrder = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await cancelOrderAPI(id);
            // Refresh list if applicable
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
            if (orderDetails && orderDetails._id === id) {
                setOrderDetails(prev => ({ ...prev, status: 'cancelled' }));
            }
            return { success: true, order: result.order };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const getSellerOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getSellerOrdersAPI();
            setOrders(result.orders || []);
            return { success: true, orders: result.orders };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (id, status) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await updateOrderStatusAPI(id, status);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            if (orderDetails && orderDetails._id === id) {
                setOrderDetails(prev => ({ ...prev, status }));
            }
            return { success: true, order: result.order };
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
        orders,
        orderDetails,
        createOrder,
        getMyOrders,
        getOrderById,
        cancelOrder,
        getSellerOrders,
        updateOrderStatus
    };
};
