import Ticket from "../models/ticket.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import { AppError } from "../utils/appError.js";
import { User } from "../models/user.model.js";
import sendEmail from "../services/email.service.js";
import { getTicketRaisedHTML } from "../html/ticketRaised.js";

// BUYER: CREATE A SUPPORT TICKET FOR AN ORDER
export const createTicket = asyncHandler(async (req, res) => {
    const { orderId, issueType, description } = req.body;

    if (!orderId || !issueType || !description) {
        throw new AppError("Order ID, Issue Type, and Description are required", 400);
    }

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString()) {
        throw new AppError("Unauthorized: You do not own this order", 403);
    }

    // Verify order eligibility (Not completed/delivered, and not cancelled)
    if (['delivered', 'cancelled'].includes(order.status)) {
        throw new AppError(`Cannot raise a support ticket because the order is ${order.status}`, 400);
    }

    // Identify unique sellers for the items in the order
    const uniqueSellers = new Set();
    for (const item of order.items) {
        if (item.productId && item.productId.seller) {
            uniqueSellers.add(item.productId.seller.toString());
        }
    }

    if (uniqueSellers.size === 0) {
        throw new AppError("No sellers found associated with the products in this order", 404);
    }

    const createdTickets = [];

    // Create a support ticket for each seller and send email notification
    for (const sellerId of uniqueSellers) {
        const ticket = await Ticket.create({
            userId: req.user._id,
            orderId,
            sellerId,
            issueType,
            description,
            status: "OPEN"
        });
        createdTickets.push(ticket);

        // Send email asynchronously
        (async () => {
            try {
                const seller = await User.findById(sellerId);
                if (seller && seller.email) {
                    const html = getTicketRaisedHTML(
                        seller.fullName,
                        ticket._id,
                        order._id,
                        issueType,
                        description,
                        req.user.fullName,
                        req.user.email,
                        req.user.phone || 'N/A'
                     );
                     await sendEmail(
                         seller.email,
                         `New Support Ticket - #${ticket._id}`,
                         `A customer has raised a support ticket for order #${order._id}.`,
                         html
                     );
                }
            } catch (err) {
                console.error("Error sending ticket email to seller:", err);
            }
        })();
    }

    res.status(201).json({
        success: true,
        message: "Support ticket(s) raised successfully",
        tickets: createdTickets
    });
});

// BUYER: GET MY RAISED TICKETS
export const getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ userId: req.user._id })
        .populate({
            path: "orderId",
            populate: {
                path: "items.productId",
                select: "title images price"
            }
        })
        .populate("sellerId", "fullName email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        tickets
    });
});

// SELLER: GET RECEIVED TICKETS
export const getSellerTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ sellerId: req.user._id })
        .populate({
            path: "orderId",
            populate: {
                path: "items.productId",
                select: "title images price"
            }
        })
        .populate("userId", "fullName email phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        tickets
    });
});

// SELLER: RESOLVE (CLOSE) TICKET
export const resolveTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        throw new AppError("Ticket not found", 404);
    }

    // Verify ownership
    if (ticket.sellerId.toString() !== req.user._id.toString()) {
        throw new AppError("Unauthorized to resolve this ticket", 403);
    }

    ticket.status = "CLOSED";
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.status(200).json({
        success: true,
        message: "Ticket marked as resolved successfully",
        ticket
    });
});
