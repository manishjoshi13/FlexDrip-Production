import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true
});

export const loginAPI = async (data) => {
    let response = await api.post("/auth/login", data);
    console.log(response.data);
    return response.data;
};

export const registerAPI = async (data) => {
    let response = await api.post("/auth/register", data);
    return response.data;
};

export const logoutAPI = async () => {
    let response = await api.post("/auth/logout");
    return response.data;
};

export const getMeAPI = async () => {
    let response = await api.get("/auth/get-me");
    return response.data;
};

export const updateProfileAPI = async (data) => {
    let response = await api.put("/auth/update-profile", data);
    return response.data;
};

export const forgotPasswordAPI = async (data) => {
    let response = await api.post("/auth/forgot-password", data);
    return response.data;
};

export const resetPasswordAPI = async (data) => {
    let response = await api.post("/auth/reset-password", data);
    return response.data;
};
