import { useState } from 'react';
import {
    createTicketAPI,
    getMyTicketsAPI,
    getSellerTicketsAPI,
    resolveTicketAPI
} from '../services/issueApi.service';

export const useIssue = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState([]);

    const createTicket = async (ticketData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createTicketAPI(ticketData);
            return { success: true, tickets: result.tickets };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const getMyTickets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getMyTicketsAPI();
            setTickets(result.tickets || []);
            return { success: true, tickets: result.tickets };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const getSellerTickets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getSellerTicketsAPI();
            setTickets(result.tickets || []);
            return { success: true, tickets: result.tickets };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const resolveTicket = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await resolveTicketAPI(id);
            setTickets(prev => prev.map(t => t._id === id ? { ...t, status: 'CLOSED', updatedAt: new Date().toISOString() } : t));
            return { success: true, ticket: result.ticket };
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
        tickets,
        createTicket,
        getMyTickets,
        getSellerTickets,
        resolveTicket
    };
};
