import { Router } from "express";
import { authenticate, buyerAuth, sellerAuth } from "../middleware/auth.middleware.js";
import {
    createTicket,
    getMyTickets,
    getSellerTickets,
    resolveTicket
} from "../controller/issue.controller.js";

const issueRouter = Router();

// Buyer routes
issueRouter.post("/create", authenticate, buyerAuth, createTicket);
issueRouter.get("/my-tickets", authenticate, buyerAuth, getMyTickets);

// Seller routes
issueRouter.get("/seller/tickets", authenticate, sellerAuth, getSellerTickets);
issueRouter.put("/seller/tickets/:id/resolve", authenticate, sellerAuth, resolveTicket);

export default issueRouter;
