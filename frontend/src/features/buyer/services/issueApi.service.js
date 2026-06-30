import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/issue`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const createTicketAPI = async (ticketData) => {
    const response = await api.post("/create", ticketData);
    return response.data;
};

export const getMyTicketsAPI = async () => {
    const response = await api.get("/my-tickets");
    return response.data;
};

export const getSellerTicketsAPI = async () => {
    const response = await api.get("/seller/tickets");
    return response.data;
};

export const resolveTicketAPI = async (id) => {
    const response = await api.put(`/seller/tickets/${id}/resolve`);
    return response.data;
};
