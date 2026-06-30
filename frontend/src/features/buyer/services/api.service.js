import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let api = axios.create({
    baseURL: `${BACKEND_URL}/api/buyer`,
    withCredentials: true
})

export const getAllProductsAPI = async () => {
    let response = await api.get('/')
    return response.data
}
export const getSingleProductAPI = async (id) => {
    let response = await api.get(`/${id}`)
    return response.data
}
export const getTrendingProductsAPI = async () => {
    let response = await api.get('/trending')
    return response.data
}
export const getSimilarProductAPI = async (id) => {
    let response = await api.get(`/${id}/similar`)
    return response.data
}

