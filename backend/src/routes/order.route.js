import { Router } from "express";
import { authenticate, buyerAuth, sellerAuth } from "../middleware/auth.middleware.js";
import { createOrder, getMyOrders, getOrderById, cancelOrder, getSellerOrders, updateOrderStatus } from "../controller/order.controller.js";

const orderRouter=Router()

// Buyer routes
orderRouter.post("/create",authenticate,buyerAuth,createOrder)
orderRouter.get("/myorders",authenticate,buyerAuth,getMyOrders)
orderRouter.get("/details/:id",authenticate,buyerAuth,getOrderById)
orderRouter.put("/cancel/:id",authenticate,buyerAuth,cancelOrder)

// Seller routes
orderRouter.get("/seller/orders",authenticate,sellerAuth,getSellerOrders)
orderRouter.put("/seller/orders/:id/status",authenticate,sellerAuth,updateOrderStatus)

export default orderRouter
