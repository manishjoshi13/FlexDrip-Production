import { Order } from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import { User } from "../models/user.model.js";
import sendEmail from "../services/email.service.js";
import { getOrderPlacedHTML } from "../html/orderplaced.js";
import { getOrderRecievedHTML } from "../html/orderRecieved.js";
import { getOrderCancelledHTML } from "../html/orderCancelled.js";
import { getSellerOrderCancelledHTML } from "../html/sellerOrderCancelled.js";
import { getSellerLowStockHTML } from "../html/sellerLowStock.js";

// CREATE ORDER FROM CART (Simulated direct order, no payment gateway)
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;
    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
        return res.status(400).json({ success: false, message: "Complete shipping address is required" });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    await cart.populate("items.productId");

    const orderItems = [];
    let totalAmount = 0;

    // Validate stock and compute prices
    for (const item of cart.items) {
        const product = item.productId;
        if (!product) {
            return res.status(404).json({ success: false, message: "One of the products in your cart no longer exists" });
        }

        let priceVal = product.price?.amount || 0;
        let actualStock = product.stock || 0;

        if (item.variantId && product.variants) {
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
            if (!variant) {
                return res.status(404).json({ success: false, message: `Selected variant no longer exists for: ${product.title}` });
            }
            if (variant.price !== undefined && variant.price !== null) {
                priceVal = typeof variant.price === 'object' ? (variant.price.amount ?? priceVal) : variant.price;
            }
            actualStock = variant.stock || 0;
        }

        if (item.quantity > actualStock) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${product.title}. Only ${actualStock} units left.`
            });
        }

        orderItems.push({
            productId: product._id,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: priceVal
        });

        totalAmount += priceVal * item.quantity;
    }

    // Deduct stock from products/variants
    for (const item of cart.items) {
        const product = await Product.findById(item.productId._id);
        if (item.variantId && product.variants) {
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
            if (variant) {
                variant.stock = Math.max(0, variant.stock - item.quantity);
            }
        } else {
            product.stock = Math.max(0, product.stock - item.quantity);
        }
        await product.save();
    }

    // Place Order directly
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        status: 'pending'
    });

    // Empty user's cart in DB
    cart.items = [];
    await cart.save();

    // Send emails asynchronously
    (async () => {
        try {
            const populatedOrder = await Order.findById(order._id)
                .populate("user", "fullName email phone")
                .populate({
                    path: "items.productId",
                    populate: {
                        path: "seller"
                    }
                });

            if (!populatedOrder) return;

            // 1. Send Order Placed Email to Buyer
            const buyerHtml = getOrderPlacedHTML(
                populatedOrder.user.fullName,
                populatedOrder._id,
                populatedOrder.items,
                populatedOrder.totalAmount,
                populatedOrder.shippingAddress
            );
            await sendEmail(
                populatedOrder.user.email,
                `Order Confirmed - #${populatedOrder._id}`,
                `Thank you for your purchase. Your order #${populatedOrder._id} is confirmed.`,
                buyerHtml
            );

            // 2. Group items by Seller and Send Order Received Email to Sellers
            const itemsBySeller = {};
            for (const item of populatedOrder.items) {
                const product = item.productId;
                const seller = product?.seller;
                if (seller) {
                    const sellerId = seller._id.toString();
                    if (!itemsBySeller[sellerId]) {
                        itemsBySeller[sellerId] = {
                            seller,
                            items: []
                        };
                    }
                    itemsBySeller[sellerId].items.push(item);
                }
            }

            for (const sellerId in itemsBySeller) {
                const { seller, items: sellerItems } = itemsBySeller[sellerId];
                const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const sellerHtml = getOrderRecievedHTML(
                    seller.fullName,
                    populatedOrder._id,
                    sellerItems,
                    sellerSubtotal,
                    populatedOrder.shippingAddress,
                    populatedOrder.user.fullName,
                    populatedOrder.user.email,
                    populatedOrder.user.phone
                );
                await sendEmail(
                    seller.email,
                    `New Order Received - #${populatedOrder._id}`,
                    `You have received a new order #${populatedOrder._id} from ${populatedOrder.user.fullName}.`,
                    sellerHtml
                );
            }

            // 3. Check for Low Stock and alert sellers
            for (const item of populatedOrder.items) {
                const product = item.productId;
                if (!product) continue;

                let remainingStock = 0;
                let variantDetails = '';
                
                if (item.variantId && product.variants) {
                    const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
                    if (variant) {
                        remainingStock = variant.stock;
                        const attrs = [];
                        if (variant.attributes) {
                            const entries = typeof variant.attributes.entries === 'function' 
                                ? Array.from(variant.attributes.entries()) 
                                : Object.entries(variant.attributes);
                            for (const [key, val] of entries) {
                                attrs.push(`${key}: ${val}`);
                            }
                        }
                        variantDetails = attrs.join(', ') || 'Variant';
                    }
                } else {
                    remainingStock = product.stock;
                }

                if (remainingStock <= 5) {
                    const seller = product.seller;
                    if (seller) {
                        const lowStockHtml = getSellerLowStockHTML(
                            seller.fullName,
                            product.title,
                            variantDetails || 'Default',
                            remainingStock
                        );
                        await sendEmail(
                            seller.email,
                            `${remainingStock === 0 ? 'Out of Stock' : 'Low Stock'} Alert: ${product.title}`,
                            `Your item ${product.title} has low stock (${remainingStock} left).`,
                            lowStockHtml
                        );
                    }
                }
            }
        } catch (emailError) {
            console.error("Error sending order confirmation emails:", emailError);
        }
    })();

    res.status(201).json({ success: true, message: "Order placed successfully", order });
});

// GET BUYER'S OWN ORDERS
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.productId")
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
});

// GET ORDER DETAILS BY ID
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "fullName email phone")
        .populate("items.productId");
        
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check permissions (buyer or seller of an item in this order)
    const isBuyer = order.user._id.toString() === req.user._id.toString();
    
    let isSeller = false;
    if (req.user.role === 'seller') {
        const sellerProducts = await Product.find({ seller: req.user._id });
        const productIds = sellerProducts.map(p => p._id.toString());
        isSeller = order.items.some(item => productIds.includes(item.productId?._id?.toString()));
    }

    if (!isBuyer && !isSeller) {
        return res.status(403).json({ success: false, message: "Unauthorized to view this order" });
    }

    res.status(200).json({ success: true, order });
});

// CANCEL BUYER ORDER
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized to cancel this order" });
    }

    if (order.status !== 'pending') {
        return res.status(400).json({ success: false, message: `Cannot cancel order in status: ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock back to product/variant inventory
    for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            if (item.variantId && product.variants) {
                const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
                if (variant) {
                    variant.stock += item.quantity;
                }
            } else {
                product.stock += item.quantity;
            }
            await product.save();
        }
    }

    // Send cancellation emails asynchronously
    (async () => {
        try {
            const populatedOrder = await Order.findById(order._id)
                .populate("user", "fullName email phone")
                .populate({
                    path: "items.productId",
                    populate: {
                        path: "seller"
                    }
                });

            if (!populatedOrder) return;

            // 1. Send Order Cancelled Email to Buyer
            const buyerHtml = getOrderCancelledHTML(
                populatedOrder.user.fullName,
                populatedOrder._id,
                populatedOrder.items,
                populatedOrder.totalAmount,
                "Cancelled by buyer"
            );
            await sendEmail(
                populatedOrder.user.email,
                `Order Cancelled - #${populatedOrder._id}`,
                `Your order #${populatedOrder._id} has been cancelled.`,
                buyerHtml
            );

            // 2. Group items by Seller and Send Seller Cancellation Email
            const itemsBySeller = {};
            for (const item of populatedOrder.items) {
                const product = item.productId;
                const seller = product?.seller;
                if (seller) {
                    const sellerId = seller._id.toString();
                    if (!itemsBySeller[sellerId]) {
                        itemsBySeller[sellerId] = {
                            seller,
                            items: []
                        };
                    }
                    itemsBySeller[sellerId].items.push(item);
                }
            }

            for (const sellerId in itemsBySeller) {
                const { seller, items: sellerItems } = itemsBySeller[sellerId];
                const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const sellerHtml = getSellerOrderCancelledHTML(
                    seller.fullName,
                    populatedOrder._id,
                    sellerItems,
                    sellerSubtotal,
                    populatedOrder.user.fullName,
                    "Cancelled by buyer"
                );
                await sendEmail(
                    seller.email,
                    `Order #${populatedOrder._id} Cancelled by Buyer`,
                    `The buyer has cancelled order #${populatedOrder._id}.`,
                    sellerHtml
                );
            }
        } catch (emailError) {
            console.error("Error sending cancellation emails:", emailError);
        }
    })();

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
});

// SELLER: GET ALL RECEIVED ORDERS
export const getSellerOrders = asyncHandler(async (req, res) => {
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map(p => p._id);

    const orders = await Order.find({
        "items.productId": { $in: productIds }
    }).populate("user", "fullName email phone").populate("items.productId").sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
        const orderObj = order.toObject();
        // Filter out items not belonging to this seller
        orderObj.items = orderObj.items.filter(item => {
            const prod = item.productId;
            return prod && prod.seller && prod.seller.toString() === req.user._id.toString();
        });
        return orderObj;
    });

    res.status(200).json({ success: true, orders: formattedOrders });
});

// SELLER: UPDATE ORDER STATUS
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify ownership of at least one product in this order
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map(p => p._id.toString());
    const ownsProduct = order.items.some(item => productIds.includes(item.productId?._id?.toString() || item.productId?.toString()));

    if (!ownsProduct) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this order" });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Restore stock if transitioning to cancelled from a non-cancelled status
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                if (item.variantId && product.variants) {
                    const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
                    if (variant) {
                        variant.stock += item.quantity;
                    }
                } else {
                    product.stock += item.quantity;
                }
                await product.save();
            }
        }

        // Send cancellation emails asynchronously
        (async () => {
            try {
                const populatedOrder = await Order.findById(order._id)
                    .populate("user", "fullName email phone")
                    .populate({
                        path: "items.productId",
                        populate: {
                            path: "seller"
                        }
                    });

                if (!populatedOrder) return;

                // 1. Send Order Cancelled Email to Buyer
                const buyerHtml = getOrderCancelledHTML(
                    populatedOrder.user.fullName,
                    populatedOrder._id,
                    populatedOrder.items,
                    populatedOrder.totalAmount,
                    "Cancelled by merchant"
                );
                await sendEmail(
                    populatedOrder.user.email,
                    `Order Cancelled - #${populatedOrder._id}`,
                    `Your order #${populatedOrder._id} has been cancelled.`,
                    buyerHtml
                );

                // 2. Group items by Seller and Send Seller Cancellation Email
                const itemsBySeller = {};
                for (const item of populatedOrder.items) {
                    const product = item.productId;
                    const seller = product?.seller;
                    if (seller) {
                        const sellerId = seller._id.toString();
                        if (!itemsBySeller[sellerId]) {
                            itemsBySeller[sellerId] = {
                                seller,
                                items: []
                            };
                        }
                        itemsBySeller[sellerId].items.push(item);
                    }
                }

                for (const sellerId in itemsBySeller) {
                    const { seller, items: sellerItems } = itemsBySeller[sellerId];
                    const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const sellerHtml = getSellerOrderCancelledHTML(
                        seller.fullName,
                        populatedOrder._id,
                        sellerItems,
                        sellerSubtotal,
                        populatedOrder.user.fullName,
                        "Cancelled by merchant"
                    );
                    await sendEmail(
                        seller.email,
                        `Order #${populatedOrder._id} Cancelled`,
                        `Order #${populatedOrder._id} has been cancelled.`,
                        sellerHtml
                    );
                }
            } catch (emailError) {
                console.error("Error sending cancellation emails:", emailError);
            }
        })();
    }

    res.status(200).json({ success: true, message: "Order status updated successfully", order });
});