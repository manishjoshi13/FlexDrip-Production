import Cart from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";

export const getMyCart = asyncHandler(async(req,res)=>{
    let cart = await Cart.findOne({user:req.user._id})


    if (!cart) {
        cart = await Cart.create({ user: req.user._id });
    }
    let data=await cart.populate("items.productId");
    let total = 0;
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        const product = item.productId;
        if (product) {
            let priceVal = product.price?.amount || 0;
            if (item.variantId && product.variants) {
                const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
                if (variant && variant.price !== undefined && variant.price !== null) {
                    priceVal = typeof variant.price === 'object' ? (variant.price.amount ?? priceVal) : variant.price;
                }
            }
            total += priceVal * item.quantity;
        }
    }
    res.status(200).json({ success: true, data: data, total: total });
})

export const createCart = asyncHandler(async(req,res)=>{
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id });
    }
    return cart;
})

export const addCartItem = asyncHandler(async(req,res)=>{
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id });
    }

    const { productId, variantId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Safe comparison for items (considering optional variantId)
    const item = cart.items.find(item => {
        const pIdMatch = item.productId.toString() === productId.toString();
        const vId1 = item.variantId ? item.variantId.toString() : null;
        const vId2 = variantId ? variantId.toString() : null;
        return pIdMatch && (vId1 === vId2);
    });

    const currentQty = item ? item.quantity : 0;
    const targetQty = currentQty + Number(quantity);

    // Resolve actual available stock for product or specific variant
    const isVariant = variantId && variantId.toString() !== 'null' && variantId.toString() !== 'undefined';
    let actualStock = 0;
    if (isVariant) {
        const variant = product.variants.find(v => v._id.toString() === variantId.toString());
        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }
        actualStock = variant.stock || 0;
    } else {
        actualStock = product.stock || 0;
    }

    // Enforce stock limit only when trying to increase quantity
    if (Number(quantity) > 0 && targetQty > actualStock) {
        return res.status(400).json({ 
            success: false, 
            message: `Cannot add more items. Only ${actualStock} unit(s) available in stock.` 
        });
    }

    if (item) {
        item.quantity = targetQty;
    } else {
        cart.items.push({ productId, variantId, quantity: Number(quantity) });
    }
    
    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json({ success: true, data: cart });
})

export const removeCartItem = asyncHandler(async(req,res)=>{
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    
    const { productId, variantId } = req.body;
    
    // Safe comparison for items (considering optional variantId)
    const item = cart.items.find(item => {
        const pIdMatch = item.productId.toString() === productId.toString();
        const vId1 = item.variantId ? item.variantId.toString() : null;
        const vId2 = variantId ? variantId.toString() : null;
        return pIdMatch && (vId1 === vId2);
    });

    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    
    cart.items.pull(item);
    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json({ success: true, data: cart });
})

export const clearCart = asyncHandler(async(req,res)=>{
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json({ success: true, data: cart });
})