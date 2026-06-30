import { useDispatch, useSelector } from "react-redux";
import { getMyCartAPI, addCartItemAPI, removeCartItemAPI, clearCartAPI } from "../services/cartApi.service";
import { setCart, setLoading, setError } from "../buyer.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    const { cart, isLoading, error } = useSelector((state) => state.buyer);
    
    const getCart = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getMyCartAPI();
            const cartData = response.data || response;
            const normalizedCart = {
                ...cartData,
                total: response.total
            };
            dispatch(setCart(normalizedCart));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const addCartItem = async (cartItem) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await addCartItemAPI(cartItem);
            dispatch(setCart(response.data || response));
            return { success: true, data: response.data || response };
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            return { success: false, error: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    }

    const removeCartItem = async (cartItem) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await removeCartItemAPI(cartItem);
            dispatch(setCart(response.data || response));
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            return { success: false, error: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    }

    const clearCart = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await clearCartAPI();
            dispatch(setCart(response.data || response));
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            return { success: false, error: errorMsg };
        } finally {
            dispatch(setLoading(false));
        }
    }

    const resetError = () => {
        dispatch(setError(null));
    }

    return {
        cart,
        isLoading,
        error,
        getCart,
        addCartItem,
        removeCartItem,
        clearCart,
        resetError
    }
}