import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBuyer } from '../hooks/useBuyer';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Navbar from '../components/Navbar';
import { ArrowLeft, AlertCircle, ShoppingBag, Truck, RotateCcw, ShieldCheck, Tag, Star, Trash2, RefreshCw } from 'lucide-react';
import { useReview } from '../hooks/useReview';
import { useOrder } from '../hooks/useOrder';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { viewProduct, fetchSimilarProducts, singleProduct, similarProducts, isLoading, error } = useBuyer();
    const { user } = useAuth();
    const { addCartItem, resetError } = useCart();

    // Reviews and Orders integration
    const { getProductReviews, createReview, deleteReview, reviews, isLoading: reviewsLoading } = useReview();
    const { getMyOrders, orders: userOrders } = useOrder();

    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedSize, setSelectedSize] = useState('M'); // Simple fallback sizing
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [cartError, setCartError] = useState(null);

    // Review form states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            viewProduct(id);
            fetchSimilarProducts(id);
            if (user) {
                getProductReviews(id);
            }
        }
        return () => {
            resetError();
        };
    }, [id, user]);

    useEffect(() => {
        if (user && user.role === 'buyer') {
            getMyOrders();
        }
    }, [user]);

    // Pre-select first in-stock variant attributes on load
    useEffect(() => {
        if (singleProduct) {
            if (singleProduct.hasVariants && singleProduct.variants?.length > 0) {
                const activeVar = singleProduct.variants.find(v => v.stock > 0) || singleProduct.variants[0];
                if (activeVar) {
                    setSelectedOptions(activeVar.attributes || {});
                }
            }
        }
    }, [singleProduct]);

    // Helper to dynamically extract options list from flat variants
    const getOptionsFromVariants = (variantsList) => {
        if (!variantsList) return [];
        const optionsMap = {};
        variantsList.forEach(v => {
            const attrs = v.attributes || {};
            const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
            entries.forEach(([key, val]) => {
                if (!optionsMap[key]) {
                    optionsMap[key] = new Set();
                }
                optionsMap[key].add(val);
            });
        });
        return Object.entries(optionsMap).map(([name, set]) => ({
            name,
            values: Array.from(set)
        }));
    };

    const resolvedOptions = singleProduct && singleProduct.hasVariants
        ? getOptionsFromVariants(singleProduct.variants)
        : [];

    // Helper to dynamically extract color specific images from variants
    const getResolvedColorImages = () => {
        if (!singleProduct || !singleProduct.variants) return [];
        const extracted = [];
        const colorOption = resolvedOptions.find(o => o.name.toLowerCase() === 'color');
        if (colorOption) {
            colorOption.values.forEach(color => {
                const match = singleProduct.variants.find(v => {
                    const attrs = v.attributes || {};
                    const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
                    const colorEntry = entries.find(([k]) => k.toLowerCase() === 'color');
                    return colorEntry && colorEntry[1] === color && v.images?.length > 0;
                });
                if (match) {
                    extracted.push({ color, images: match.images });
                }
            });
        }
        return extracted;
    };

    const resolvedColorImages = getResolvedColorImages();

    // Resolve dynamic image gallery
    const getResolvedGallery = () => {
        if (!singleProduct) return [];
        let gallery = [];
        
        // 1. Try color-specific images
        if (singleProduct.hasVariants && resolvedColorImages.length > 0) {
            const colorOptionKey = Object.keys(selectedOptions).find(k => k.toLowerCase() === 'color');
            const colorVal = colorOptionKey ? selectedOptions[colorOptionKey] : null;
            if (colorVal) {
                const colorEntry = resolvedColorImages.find(ci => ci.color.toLowerCase() === colorVal.toLowerCase());
                if (colorEntry && colorEntry.images?.length > 0) {
                    gallery = colorEntry.images;
                }
            }
        }
        
        // 2. Try variant specific images
        if (gallery.length === 0 && singleProduct.hasVariants && singleProduct.variants) {
            const activeVariant = singleProduct.variants.find(v => 
                Object.entries(selectedOptions).every(([k, val]) => {
                    const attrs = v.attributes || {};
                    const attrVal = attrs[k] || (typeof attrs.get === 'function' ? attrs.get(k) : null);
                    return attrVal === val;
                })
            );
            if (activeVariant && activeVariant.images?.length > 0) {
                gallery = activeVariant.images;
            }
        }
        
        // 3. Fallback to product level base images
        if (gallery.length === 0) {
            gallery = singleProduct.images || [];
        }
        return gallery;
    };

    const resolvedGallery = getResolvedGallery();
    const hasImages = resolvedGallery && resolvedGallery.length > 0;
    const activeImage = hasImages ? resolvedGallery[activeImageIndex]?.url : null;

    // Reset active image index whenever the resolved gallery changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [resolvedGallery?.length]);

    const handleBackClick = () => {
        navigate('/');
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role === 'seller') {
            alert('Sellers are not permitted to add products to the shopping bag.');
            return;
        }

        setCartError(null);

        const payload = {
            productId: singleProduct._id || singleProduct.id,
            variantId: activeVariant?._id || activeVariant?.id || null,
            quantity: quantity
        };

        const result = await addCartItem(payload);
        if (result && result.success) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        } else {
            setCartError(result?.error || 'Failed to add item to bag');
            setTimeout(() => setCartError(null), 5000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow flex flex-col justify-center">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
                        <div className="lg:col-span-4 aspect-[4/5] bg-gray-200 rounded-2xl" />
                        <div className="lg:col-span-8 space-y-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-20 bg-gray-200 rounded w-full" />
                            <div className="h-10 bg-gray-200 rounded w-1/2" />
                            <div className="h-12 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!singleProduct) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col">
                <Navbar />
                <div className="max-w-md mx-auto px-4 py-20 text-center flex-grow flex flex-col justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 stroke-[1.5]" />
                    <h2 className="text-xl font-bold text-gray-950 mb-2">Product Not Found</h2>
                    <p className="text-sm text-gray-500 font-medium mb-6">
                        {error || "The product you are looking for might have been removed or is temporarily unavailable."}
                    </p>
                    <button
                        onClick={handleBackClick}
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const { title, description, price } = singleProduct;
    const filteredSimilarProducts = (similarProducts || []).filter(
        (prod) => (prod._id || prod.id) !== (singleProduct?._id || singleProduct?.id)
    );
    // Resolve active variant pricing & stock
    const activeVariant = singleProduct.hasVariants && singleProduct.variants
        ? singleProduct.variants.find(v => 
            Object.entries(selectedOptions).every(([k, val]) => {
                const attrVal = v.attributes[k] || (typeof v.attributes.get === 'function' ? v.attributes.get(k) : null);
                return attrVal === val;
            })
          )
        : null;

    const currencySymbol = currencySymbols[activeVariant?.price?.currency || price?.currency] || '₹';
    const priceAmount = price?.amount !== undefined ? price.amount : 0;

    const resolvedPriceAmount = activeVariant?.price !== undefined && activeVariant?.price !== null
        ? (typeof activeVariant.price === 'object' && activeVariant.price.amount !== undefined ? activeVariant.price.amount : activeVariant.price)
        : priceAmount;

    const resolvedStock = singleProduct.hasVariants
        ? (activeVariant ? activeVariant.stock : 0)
        : (singleProduct.stock !== undefined ? singleProduct.stock : 0);

    const isOutOfStock = resolvedStock === 0;

    // Helper to evaluate availability/stock state of an option value
    const getOptionValueState = (optionName, optionValue) => {
        if (!singleProduct.variants) return 'available';
        
        // Form a hypothetical attribute selection map
        const hypSelections = { ...selectedOptions, [optionName]: optionValue };
        
        // Find if any variant combination exists for this selection
        const matches = singleProduct.variants.filter(v => {
            return Object.entries(hypSelections).every(([key, val]) => {
                if (!val) return true;
                const attrVal = v.attributes[key] || (typeof v.attributes.get === 'function' ? v.attributes.get(key) : null);
                return attrVal === val;
            });
        });

        if (matches.length === 0) return 'unavailable'; // Dependent configuration does not exist
        
        const hasStock = matches.some(v => v.stock > 0);
        return hasStock ? 'available' : 'out-of-stock';
    };

    const isVerifiedBuyer = userOrders?.some(order => 
        order.status !== 'cancelled' && 
        order.items?.some(item => (item.productId?._id || item.productId?.id || item.productId) === id)
    ) || false;

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(false);

        if (comment.trim().length < 5) {
            setSubmitError("Review comment must be at least 5 characters long.");
            return;
        }

        const payload = {
            rating,
            comment: comment.trim(),
            isVerifiedBuyer
        };

        const result = await createReview(id, payload);
        if (result && result.success) {
            setSubmitSuccess(true);
            setComment("");
            setRating(5);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } else {
            setSubmitError(result?.error || "Failed to submit review.");
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete your review?")) {
            const result = await deleteReview(id, reviewId);
            if (!result.success) {
                alert(result.error || "Failed to delete review");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
                {/* Back Link */}
                <button
                    onClick={handleBackClick}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Panel: Images Gallery */}
                    <div className="lg:col-span-5 max-h-[36rem] flex flex-col md:flex-row gap-4">
                        {/* Thumbnail Bar */}
                        {hasImages && resolvedGallery.length > 1 && (
                            <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
                                {resolvedGallery.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`aspect-square w-16 rounded-lg overflow-hidden border-2 shrink-0 bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-105
                                            ${activeImageIndex === index ? 'border-black scale-[0.98]' : 'border-transparent hover:border-neutral-400'}`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Large Highlight Image */}
                        <div className="w-full aspect-[4/5] md:max-w-md bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm order-1 md:order-2">
                            {activeImage ? (
                                <img 
                                    src={activeImage} 
                                    alt={title} 
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8">
                                    <Tag className="w-12 h-12 stroke-[1.25] mb-2" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Content & Purchase Details */}
                    <div className="lg:col-span-7 space-y-8 flex flex-col justify-start py-2">
                        {/* Title & Brand */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
                                FLEXDRIP ORIGINALS
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                                {title}
                            </h1>
                            <div className="text-xl sm:text-2xl font-bold text-black pt-1">
                                {currencySymbol}{Number(resolvedPriceAmount).toLocaleString()}
                                {isOutOfStock && (
                                    <span className="ml-3 inline-block bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-100">
                                        Sold Out
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h4>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Dynamic Variant Options Selectors */}
                        {singleProduct.hasVariants && resolvedOptions && resolvedOptions.length > 0 ? (
                            <div className="space-y-6">
                                {resolvedOptions.map((opt) => (
                                    <div key={opt.name} className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                                            <span>Select {opt.name}</span>
                                            {opt.name.toLowerCase() === 'size' && (
                                                <a href="#" className="underline text-gray-500 hover:text-black transition-colors">Size Guide</a>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {opt.values.map((val) => {
                                                const valState = getOptionValueState(opt.name, val);
                                                const isSelected = selectedOptions[opt.name] === val;
                                                
                                                return (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        disabled={valState === 'unavailable'}
                                                        onClick={() => {
                                                            setSelectedOptions({
                                                                ...selectedOptions,
                                                                [opt.name]: val
                                                            });
                                                        }}
                                                        className={`min-w-11 h-11 px-4 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer
                                                            ${valState === 'unavailable' 
                                                                ? 'border-neutral-100 bg-neutral-50/50 text-neutral-300 cursor-not-allowed opacity-30 line-through' 
                                                                : valState === 'out-of-stock' 
                                                                    ? isSelected
                                                                        ? 'bg-neutral-100 border-red-500 text-red-500 line-through'
                                                                        : 'bg-white border-neutral-200 text-neutral-400 border-dashed line-through hover:border-red-400'
                                                                    : isSelected
                                                                        ? 'bg-black border-black text-white shadow-md hover:-translate-y-0.5' 
                                                                        : 'bg-white border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50 hover:-translate-y-0.5'
                                                            }`}
                                                        title={valState === 'out-of-stock' ? 'Out of stock' : valState === 'unavailable' ? 'Configuration not available' : ''}
                                                    >
                                                        {val}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Simple Product Size Fallback (e.g. for Shirts category if variants are not set up) */
                            !singleProduct.hasVariants && singleProduct.category === 'SHIRTS' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                                        <span>Select Size</span>
                                        <a href="#" className="underline text-gray-500 hover:text-black transition-colors">Size Guide</a>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-11 h-11 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm
                                                    ${selectedSize === size 
                                                        ? 'bg-black border-black text-white shadow-md' 
                                                        : 'bg-white border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Quantity Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Quantity</label>
                            <div className="flex items-center border border-neutral-200 rounded-xl w-32 bg-white overflow-hidden shadow-sm">
                                <button
                                    type="button"
                                    disabled={isOutOfStock}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3.5 py-2.5 text-xs font-bold text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                                >
                                    -
                                </button>
                                <span className="flex-grow text-center text-xs font-bold text-neutral-900">{isOutOfStock ? 0 : quantity}</span>
                                <button
                                    type="button"
                                    disabled={isOutOfStock}
                                    onClick={() => setQuantity(Math.min(resolvedStock, quantity + 1))}
                                    className="px-3.5 py-2.5 text-xs font-bold text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="space-y-3 pt-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`group w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:shadow-lg transition-all duration-300 cursor-pointer
                                    ${isOutOfStock 
                                        ? 'bg-neutral-200 border border-neutral-200 text-neutral-400 cursor-not-allowed' 
                                        : 'bg-black text-white hover:bg-neutral-900 hover:shadow-neutral-950/15 hover:-translate-y-0.5 active:scale-[0.98]'
                                    }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                                {isOutOfStock ? 'Sold Out' : 'Add To Bag'}
                            </button>
                            {addedToCart && (
                                <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl text-[10px] text-green-700 font-bold text-center animate-in fade-in duration-200">
                                    Product added to bag successfully
                                </div>
                            )}
                            {cartError && (
                                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-700 font-bold text-center animate-in fade-in duration-200">
                                    {cartError}
                                </div>
                            )}
                        </div>

                        {/* Assurances Details */}
                        <div className="border border-neutral-100 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] grid grid-cols-1 gap-4.5 text-xs font-medium text-neutral-500">
                            <div className="flex items-start gap-3">
                                <Truck className="w-4.5 h-4.5 text-neutral-800 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider">Free Express Delivery</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Complimentary dispatch on orders above ₹1,999.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3.5 border-t border-neutral-50 pt-4.5">
                                <RotateCcw className="w-4.5 h-4.5 text-neutral-800 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider">Easy Returns</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Hassle-free 7-day swap/return guarantee.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3.5 border-t border-neutral-50 pt-4.5">
                                <ShieldCheck className="w-4.5 h-4.5 text-neutral-800 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider">Secure Transactions</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Fully encrypted payments for worry-free shopping.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-neutral-200/50 pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left column: Reviews List */}
                        <div className="lg:col-span-7 space-y-6">
                            <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-900 uppercase">
                                Customer Reviews ({reviews?.length || 0})
                            </h3>

                            {!user ? (
                                <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                                    <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">Authentication Required</p>
                                    <p className="text-xs text-neutral-500 font-medium mb-4">Please log in to view product reviews and share your feedback.</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer border-none"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            ) : reviewsLoading ? (
                                <div className="flex justify-center py-10">
                                    <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
                                </div>
                            ) : reviews?.length === 0 ? (
                                <div className="bg-neutral-50/50 rounded-2xl p-8 text-center border border-neutral-200/30">
                                    <p className="text-xs text-neutral-400 font-medium italic">No reviews yet for this product. Be the first to leave one!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                                    {reviews.map((rev) => {
                                        const formattedRevDate = new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        });
                                        const isOwnReview = user && (rev.buyerId?._id === user._id || rev.buyerId === user._id);

                                        return (
                                            <div key={rev._id} className="bg-white border border-neutral-150 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.005)] hover:border-neutral-300 transition-all duration-300">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-neutral-900 capitalize">{rev.buyerId?.fullName || 'Anonymous'}</span>
                                                            {rev.isVerifiedBuyer && (
                                                                <span className="text-[8px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                                                                    Verified Buyer
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-0.5 mt-1.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star 
                                                                    key={star} 
                                                                    className={`w-3 h-3 ${star <= rev.rating ? 'text-neutral-950 fill-neutral-950' : 'text-neutral-200'}`} 
                                                                />
                                                            ))}
                                                            <span className="text-[10px] text-neutral-400 font-semibold ml-1.5">{formattedRevDate}</span>
                                                        </div>
                                                    </div>
                                                    {isOwnReview && (
                                                        <button
                                                            onClick={() => handleReviewDelete(rev._id)}
                                                            className="p-1 text-neutral-350 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
                                                            title="Delete review"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-600 leading-relaxed font-medium mt-3.5 pl-0.5">{rev.comment}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right column: Write Review Form */}
                        <div className="lg:col-span-5">
                            {user && user.role === 'buyer' ? (
                                <div className="bg-white border border-neutral-200/60 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-5">
                                    <div className="border-b border-neutral-100 pb-3">
                                        <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-900 uppercase">
                                            Write A Review
                                        </h3>
                                        <p className="text-[10px] text-neutral-400 font-semibold mt-1 uppercase tracking-wide">Share your experience with this item</p>
                                    </div>

                                    {isVerifiedBuyer && (
                                        <div className="bg-emerald-50/55 border border-emerald-100/70 p-3 rounded-xl flex items-center gap-2 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Verified purchase detected!
                                        </div>
                                    )}

                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Rating</label>
                                            <div className="flex items-center gap-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="p-1 hover:scale-110 active:scale-95 transition-all bg-transparent border-none cursor-pointer"
                                                    >
                                                        <Star 
                                                            className={`w-6 h-6 transition-colors ${star <= rating ? 'text-neutral-950 fill-neutral-950' : 'text-neutral-200'}`} 
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Your Comment</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Review details about style, quality, fit, or material..."
                                                required
                                                rows={4}
                                                className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-300 focus:bg-white rounded-xl p-3.5 text-xs font-medium outline-none transition-all placeholder:text-neutral-400 placeholder:font-normal resize-none"
                                            />
                                        </div>

                                        {submitError && (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 font-bold text-center">
                                                {submitError}
                                            </div>
                                        )}

                                        {submitSuccess && (
                                            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-[10px] text-green-700 font-bold text-center">
                                                Review submitted successfully!
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={reviewsLoading}
                                            className="w-full bg-black text-white hover:bg-neutral-900 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50"
                                        >
                                            {reviewsLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : user ? (
                                <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100/50">
                                    <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Seller View Mode</p>
                                    <p className="text-[10px] text-neutral-500 font-medium mt-1 leading-relaxed">Sellers cannot submit reviews for products.</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Similar Products Carousel */}
                {filteredSimilarProducts.length > 0 && (
                    <div className="mt-20 border-t border-neutral-200/50 pt-12">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-900 uppercase mb-6">
                            You May Also Like
                        </h3>
                        <div className="relative">
                            <div 
                                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {filteredSimilarProducts.map((prod) => {
                                    const prodPrice = prod.price?.amount || 0;
                                    const prodCurrency = currencySymbols[prod.price?.currency] || '₹';
                                    const prodImg = prod.images && prod.images.length > 0 ? prod.images[0].url : '';

                                    return (
                                        <div 
                                            key={prod._id || prod.id}
                                            onClick={() => navigate(`/product/${prod._id || prod.id}`)}
                                            className="w-44 shrink-0 group cursor-pointer snap-start"
                                        >
                                            <div className="aspect-[3/4] w-full bg-white rounded-2xl overflow-hidden border border-neutral-100 mb-2.5 relative shadow-sm">
                                                {prodImg ? (
                                                    <img 
                                                        src={prodImg} 
                                                        alt={prod.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                        <Tag className="w-8 h-8 stroke-[1.25]" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-[10px] font-bold text-neutral-800 truncate uppercase tracking-wider group-hover:text-black transition-colors">
                                                {prod.title}
                                            </h4>
                                            <span className="text-xs font-bold text-neutral-950 block mt-0.5">
                                                {prodCurrency}{Number(prodPrice).toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-100 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400 font-medium">
                    © 2026 FLEXDRIP CLOTHING CO. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
};

export default ProductDetails;
