import { useDispatch, useSelector } from "react-redux"
import { setError, setLoading, setSingleProduct, setAllProducts, setSimilarProducts, setTrendingProducts } from "../buyer.slice"
import { getAllProductsAPI, getSingleProductAPI, getSimilarProductAPI, getTrendingProductsAPI } from "../services/api.service"
export const useBuyer=()=>{
    const dispatch=useDispatch()
    const { allProducts, trendingProducts, singleProduct, similarProducts, error, isLoading, cart } = useSelector((state)=>state.buyer)
    const viewProduct=async(id)=>{
        dispatch(setLoading(true))
        try {
            const response=await getSingleProductAPI(id)
            if(response?.success){
                dispatch(setSingleProduct(response.product))
            }
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    const fetchProducts = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getAllProductsAPI();
            if (response?.success) {
                dispatch(setAllProducts(response.products));
            }
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchTrendingProducts = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getTrendingProductsAPI();
            if (response?.success) {
                dispatch(setTrendingProducts(response.products));
            }
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };


    const fetchSimilarProducts=async(id)=>{
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const response=await getSimilarProductAPI(id)
            if(response?.success){
                dispatch(setSimilarProducts(response.products))
            }
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { fetchProducts, fetchTrendingProducts, viewProduct, fetchSimilarProducts, allProducts, trendingProducts, singleProduct, similarProducts, error, isLoading, cart };
}