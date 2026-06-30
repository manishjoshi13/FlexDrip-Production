import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";

export const getAllProducts=asyncHandler(async(req,res)=>{
    const products = await Product.aggregate([
        {
            $sample: { size: 10 }
        }
    ]);
    if(!products){
        return res.status(200).json({success:true,products:[],message:"No products found"})
    }
    return res.status(200).json({success:true,products,message:"Products fetched successfully"})
})
export const getSinglePRoduct=asyncHandler(async(req,res)=>{
    const {productId} = req.params
    const product=await Product.findById(productId)
    if(!product){
        return res.status(404).json({success:false,message:"Product not found"})
    }
    return res.status(200).json({success:true,product,message:"Product fetched successfully"})
})


export const getSimilarProducts=asyncHandler(async(req,res)=>{
    const productId=req.params.productId
    const product=await Product.findById(productId)
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    const similarProducts=await Product.find({
        category:product.category,
        _id: { $ne: productId }
    })
    return res.status(200).json({success:true,products:similarProducts || [],message:"Products fetched successfully"})
})

export const getTrendingProducts = asyncHandler(async (req, res) => {
    // Fetch all non-cancelled orders, sorted by newest first
    const orders = await Order.find({ status: { $ne: 'cancelled' } })
        .sort({ createdAt: -1 })
        .populate('items.productId');

    const productMap = new Map();
    for (const order of orders) {
        for (const item of order.items) {
            if (item.productId && item.productId._id) {
                const prodIdStr = item.productId._id.toString();
                if (!productMap.has(prodIdStr)) {
                    productMap.set(prodIdStr, item.productId);
                    if (productMap.size === 10) break;
                }
            }
        }
        if (productMap.size === 10) break;
    }

    const trendingProducts = Array.from(productMap.values());

    return res.status(200).json({
        success: true,
        products: trendingProducts,
        message: "Trending products fetched successfully"
    });
})

