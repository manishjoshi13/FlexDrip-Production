import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let api = axios.create({
    baseURL: `${BACKEND_URL}/api/product`,
    withCredentials: true
})

export const createProductAPI = async (data) => {
    let response = await api.post("/create", data);
    return response.data;
}
export const getMyProductsAPI = async () => {
    let response = await api.get("/myproducts");
    return response.data;
}
export const getProductByIdAPI = async (id) => {
    let response = await api.get(`/details/${id}`);
    return response.data;
}
export const updateProductAPI = async (id, data) => {
    let response = await api.put(`/update/${id}`, data);
    return response.data;
}
export const deleteProductAPI = async (id) => {
    let response = await api.delete(`/delete/${id}`);
    return response.data;
}
export const addVariantAPI = async (productId, data) => {
    let response = await api.post(`/${productId}/variants`, data);
    return response.data;
}
export const updateVariantAPI = async (productId, variantId, data) => {
    let response = await api.put(`/${productId}/variants/${variantId}`, data);
    return response.data;
}
export const deleteVariantAPI = async (productId, variantId) => {
    let response = await api.delete(`/${productId}/variants/${variantId}`);
    return response.data;
}