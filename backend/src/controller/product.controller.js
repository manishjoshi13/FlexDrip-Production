import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import { imageKit } from "../services/imageKit.js";

const createProduct = asyncHandler(async (req, res, next) => {
    const { title, description, priceAmount, priceCurrency, category, stock, hasVariants, variants } = req.body;
    
    const uploadedImages = await Promise.all(req.files.map((file) => {
        return imageKit.files.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "flexdrip/products"
        })
    }))
    const images = uploadedImages.map(img => ({
        url: img.url,
        fileId: img.fileId
    }))

    let parsedVariants = [];
    if (variants) {
        try {
            const rawVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
            parsedVariants = rawVariants.map(v => {
                const variantImages = [];
                if (v.images) {
                    variantImages.push(...v.images);
                }
                if (v.newImageIndices) {
                    v.newImageIndices.forEach(idx => {
                        if (images[idx]) {
                            variantImages.push(images[idx]);
                        }
                    });
                }
                return {
                    attributes: v.attributes,
                    stock: Number(v.stock) || 0,
                    price: v.price && v.price.amount ? {
                        amount: Number(v.price.amount),
                        currency: v.price.currency || priceCurrency || 'INR'
                    } : undefined,
                    images: variantImages
                };
            });
        } catch (e) {
            return res.status(400).json({ message: "Invalid variants format" });
        }
    }

    const product = new Product({
        title,
        description,
        price: { amount: Number(priceAmount), currency: priceCurrency || 'INR' },
        images,
        category: category || 'ESSENTIALS',
        stock: stock ? Number(stock) : 0,
        hasVariants: hasVariants === 'true' || hasVariants === true,
        variants: parsedVariants,
        seller: req.user.id
    })
    await product.save()
    res.status(201).json({ message: "Product created successfully", product })
})

const getMyProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({ seller: req.user.id })
    res.status(200).json({ message: "Products fetched successfully", products })
})

const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
})

const updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    // Check ownership
    if (product.seller.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    const { title, description, priceAmount, priceCurrency, category, stock, hasVariants, variants, existingImages } = req.body;

    // Parse existing images remaining
    let parsedExistingImages = [];
    if (existingImages) {
        try {
            parsedExistingImages = JSON.parse(existingImages);
        } catch (e) {
            return res.status(400).json({ message: "Invalid existingImages format" });
        }
    }

    // Determine removed images and delete them from ImageKit
    const existingUrls = parsedExistingImages.map(img => img.url);
    const removedImages = product.images.filter(img => !existingUrls.includes(img.url));

    await Promise.all(removedImages.map(async (img) => {
        if (img.fileId) {
            try {
                await imageKit.files.delete(img.fileId);
            } catch (err) {
                console.error(`Failed to delete file ${img.fileId} from ImageKit:`, err);
            }
        }
    }));

    // Upload new images if any
    let newUploadedImages = [];
    if (req.files && req.files.length > 0) {
        const uploads = await Promise.all(req.files.map((file) => {
            return imageKit.files.upload({
                file: file.buffer.toString("base64"),
                fileName: file.originalname,
                folder: "flexdrip/products"
            });
        }));
        newUploadedImages = uploads.map(img => ({
            url: img.url,
            fileId: img.fileId
        }));
    }

    const finalImages = [...parsedExistingImages, ...newUploadedImages];
    if (finalImages.length === 0) {
        return res.status(400).json({ message: "At least one product image is required" });
    }

    let parsedVariants = [];
    if (variants) {
        try {
            const rawVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
            parsedVariants = rawVariants.map(v => {
                const variantImages = [];
                // Add existing images for this variant (must match url with finalImages)
                if (v.images) {
                    v.images.forEach(img => {
                        if (existingUrls.includes(img.url)) {
                            variantImages.push(img);
                        }
                    });
                }
                // Add newly uploaded images mapped to this variant
                if (v.newImageIndices) {
                    v.newImageIndices.forEach(idx => {
                        if (newUploadedImages[idx]) {
                            variantImages.push(newUploadedImages[idx]);
                        }
                    });
                }

                return {
                    _id: v._id,
                    attributes: v.attributes,
                    stock: Number(v.stock) || 0,
                    price: v.price && v.price.amount ? {
                        amount: Number(v.price.amount),
                        currency: v.price.currency || priceCurrency || 'INR'
                    } : undefined,
                    images: variantImages
                };
            });
        } catch (e) {
            return res.status(400).json({ message: "Invalid variants format" });
        }
    }

    product.title = title;
    product.description = description;
    product.price = { amount: Number(priceAmount), currency: priceCurrency || 'INR' };
    product.images = finalImages;
    if (category) product.category = category;
    product.stock = stock ? Number(stock) : 0;
    product.hasVariants = hasVariants === 'true' || hasVariants === true;
    product.variants = parsedVariants;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    // Delete files from ImageKit
    if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map(async (img) => {
            if (img.fileId) {
                try {
                    await imageKit.files.delete(img.fileId);
                } catch (err) {
                    console.error(`Failed to delete file ${img.fileId} from ImageKit:`, err);
                }
            }
        }));
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
})

// Add new variant
const addProductVariant = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You are not authorized to edit this product" });
    }

    const { attributes, price, stock, images } = req.body;
    if (!attributes || stock === undefined) {
        return res.status(400).json({ message: "Attributes and stock are required" });
    }

    const newVariant = {
        attributes,
        price: price && price.amount ? { amount: Number(price.amount), currency: price.currency || 'INR' } : undefined,
        stock: Number(stock),
        images: images || []
    };

    product.variants.push(newVariant);
    product.hasVariants = true;
    await product.save();

    res.status(201).json({ message: "Variant added successfully", product });
});

// Update specific variant
const updateProductVariant = asyncHandler(async (req, res, next) => {
    const { id, variantId } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You are not authorized to edit this product" });
    }

    const variant = product.variants.find(v => v._id.toString() === variantId);
    if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
    }

    const { attributes, price, stock, images } = req.body;
    if (attributes) variant.attributes = attributes;
    if (price !== undefined) {
        variant.price = price && price.amount ? { amount: Number(price.amount), currency: price.currency || 'INR' } : undefined;
    }
    if (stock !== undefined) variant.stock = Number(stock);
    if (images) variant.images = images;

    await product.save();
    res.status(200).json({ message: "Variant updated successfully", product });
});

// Delete specific variant
const deleteProductVariant = asyncHandler(async (req, res, next) => {
    const { id, variantId } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You are not authorized to edit this product" });
    }

    const variantIndex = product.variants.findIndex(v => v._id.toString() === variantId);
    if (variantIndex === -1) {
        return res.status(404).json({ message: "Variant not found" });
    }

    product.variants.splice(variantIndex, 1);
    if (product.variants.length === 0) {
        product.hasVariants = false;
    }

    await product.save();
    res.status(200).json({ message: "Variant deleted successfully", product });
});

export { createProduct, getMyProducts, getProductById, updateProduct, deleteProduct, addProductVariant, updateProductVariant, deleteProductVariant }