import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../../auth/hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import Navbar from '../components/Navbar';
import { ShoppingBag, Trash2, ArrowRight, Loader2, Minus, Plus, AlertCircle, CheckCircle, Tag, ArrowLeft } from 'lucide-react';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, isLoading, error, getCart, addCartItem, removeCartItem, clearCart, resetError } = useCart();

    const { createOrder } = useOrder();

    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        addressLine: '',
        city: '',
        state: '',
        postalCode: ''
    });

    useEffect(() => {
        if (user) {
            getCart();
        }
        return () => {
            resetError();
        };
    }, [user]);

    const handleQuantityChange = async (productId, variantId, currentQty, delta) => {
        if (currentQty + delta <= 0) return;
        await addCartItem({ productId, variantId, quantity: delta });
    };

    const handleRemoveItem = async (productId, variantId) => {
        await removeCartItem({ productId, variantId });
    };

    const handleCheckoutClick = () => {
        setCheckoutError('');
        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.profileCompleted) {
            setCheckoutError('Please complete your profile details before checking out.');
            return;
        }

        const items = cart?.items || [];
        const hasStockIssue = items.some(item => {
            const product = item.productId || {};
            let maxAllowedStock = 0;
            if (item.variantId && product.variants) {
                const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                if (match) {
                    maxAllowedStock = match.stock || 0;
                }
            } else {
                maxAllowedStock = product.stock || 0;
            }
            return item.quantity > maxAllowedStock;
        });

        if (hasStockIssue) {
            setCheckoutError('Some items in your cart exceed available stock. Please adjust quantities.');
            return;
        }

        setShowAddressModal(true);
    };

    const handlePlaceOrderSubmit = async (e) => {
        e.preventDefault();
        setCheckoutError('');

        if (!addressForm.addressLine || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
            setCheckoutError('Complete address details are required.');
            return;
        }

        setCheckoutLoading(true);
        const res = await createOrder({ shippingAddress: addressForm });
        setCheckoutLoading(false);

        if (res && res.success) {
            await clearCart();
            setCheckoutSuccess(true);
            setShowAddressModal(false);
        } else {
            setCheckoutError(res?.error || 'Failed to place your order.');
        }
    };

    // Calculate subtotal
    const itemsList = cart?.items || [];
    const subtotal = cart?.total !== undefined ? cart.total : itemsList.reduce((sum, item) => {
        const product = item.productId || {};
        let priceVal = product.price?.amount || 0;
        if (item.variantId && product.variants) {
            const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
            if (match && match.price !== undefined && match.price !== null) {
                priceVal = typeof match.price === 'object' ? (match.price.amount ?? priceVal) : match.price;
            }
        }
        return sum + (priceVal * item.quantity);
    }, 0);

    const currencySymbol = itemsList.length > 0
        ? (currencySymbols[itemsList[0]?.productId?.price?.currency] || '₹')
        : '₹';

    if (isLoading && itemsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-16 w-full flex-grow flex flex-col justify-center items-center text-gray-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                    <span className="text-sm font-semibold">Loading your bag...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between border-b border-neutral-200/50 pb-6">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="group inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider mb-2 cursor-pointer"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            Continue Shopping
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Shopping Bag</h1>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Review your selections and process checkouts.</p>
                    </div>
                    <div className="p-2.5 bg-neutral-100 rounded-xl">
                        <ShoppingBag className="w-5 h-5 text-neutral-800" />
                    </div>
                </div>

                {checkoutSuccess ? (
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-12 text-center max-w-lg mx-auto animate-in fade-in duration-300">
                        <div className="p-4 bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-green-100">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-green-800">Order Placed Successfully</h3>
                        <p className="text-xs text-neutral-400 font-medium mt-2 leading-relaxed">
                            Thank you for shopping with FlexDrip! Your simulated order has been registered and is being processed.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                                Track Order Status
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="border border-neutral-200 text-neutral-700 bg-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : itemsList.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-12 text-center max-w-lg mx-auto">
                        <div className="p-4 bg-neutral-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-6 h-6 text-neutral-400" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Your Bag is Empty</h3>
                        <p className="text-xs text-neutral-400 font-medium mt-1.5 leading-relaxed">
                            Looks like you haven't added any designer couture to your shopping bag yet.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 inline-flex items-center gap-1.5 bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                            Explore Collection
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-7 space-y-4">
                            {itemsList.map((item, idx) => {
                                const product = item.productId || {};
                                let priceVal = product.price?.amount || 0;
                                let currencyStr = product.price?.currency || 'INR';

                                // Find variant details if variantId exists
                                let variantLabel = '';
                                let maxAllowedStock = 0;
                                let resolvedImage = product.images && product.images.length > 0 ? product.images[0].url : null;
                                if (item.variantId && product.variants) {
                                    const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                    if (match) {
                                        maxAllowedStock = match.stock || 0;
                                        if (match.images && match.images.length > 0) {
                                            resolvedImage = match.images[0].url;
                                        }
                                        if (match.price !== undefined && match.price !== null) {
                                            priceVal = typeof match.price === 'object' ? (match.price.amount ?? priceVal) : match.price;
                                            currencyStr = typeof match.price === 'object' ? (match.price.currency ?? currencyStr) : currencyStr;
                                        }
                                        if (match.attributes) {
                                            const attrs = match.attributes;
                                            variantLabel = Object.entries(attrs)
                                                .map(([k, val]) => `${k}: ${val}`)
                                                .join(' / ');
                                        }
                                    }
                                } else {
                                    maxAllowedStock = product.stock || 0;
                                }

                                return (
                                    <div key={idx} className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-4 flex gap-4 items-center">
                                        {/* Product Photo */}
                                        <div className="w-20 h-24 bg-neutral-50 rounded-2xl overflow-hidden shrink-0 border border-neutral-50">
                                            {resolvedImage ? (
                                                <img src={resolvedImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Tag className="w-6 h-6 stroke-[1.25]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow min-w-0 space-y-1">
                                            <h4 className="text-xs font-bold text-neutral-900 truncate uppercase tracking-wider">{product.title || 'Product'}</h4>
                                            {variantLabel && (
                                                <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wide block">
                                                    {variantLabel}
                                                </span>
                                            )}
                                            {item.quantity > maxAllowedStock && (
                                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide block">
                                                    Only {maxAllowedStock} unit(s) left in stock
                                                </span>
                                            )}
                                            <div className="text-xs font-bold text-neutral-950 pt-1">
                                                {currencySymbols[currencyStr] || '₹'}{Number(priceVal).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Quantity & Delete Controls */}
                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            {/* Quantity Adjuster */}
                                            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                                <button
                                                    type="button"
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => handleQuantityChange(product._id || product.id, item.variantId, item.quantity, -1)}
                                                    className="p-1 px-2 text-[10px] font-bold hover:bg-neutral-50 transition-colors disabled:opacity-30"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2 text-xs font-bold text-neutral-800">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    disabled={item.quantity >= maxAllowedStock}
                                                    onClick={() => handleQuantityChange(product._id || product.id, item.variantId, item.quantity, 1)}
                                                    className="p-1 px-2 text-[10px] font-bold hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Trash button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(product._id || product.id, item.variantId)}
                                                className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Panel */}
                        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 space-y-6">
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-50">Summary</h3>

                            {/* Calculation rows */}
                            <div className="space-y-3 text-xs font-semibold text-neutral-500">
                                <div className="flex justify-between">
                                    <span>Bag Subtotal</span>
                                    <span className="text-neutral-900">{currencySymbol}{Number(subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase tracking-wider">Free</span>
                                </div>
                                <div className="border-t border-neutral-55 pt-3 flex justify-between text-sm font-bold text-neutral-950">
                                    <span>Total Price</span>
                                    <span>{currencySymbol}{Number(subtotal).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Verification/Error banners */}
                            {(checkoutError || error) && (
                                <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-semibold leading-relaxed">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                                    <div>{checkoutError || error}</div>
                                </div>
                            )}

                            {user?.profileCompleted === false && (
                                <div className="p-3.5 bg-amber-50 border border-amber-100/70 rounded-2xl flex items-start gap-2 text-xs text-amber-800 font-medium leading-relaxed">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                    <div>
                                        Please **complete your profile** details before placing your order.
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="block underline font-bold mt-1 text-amber-900 uppercase tracking-wide hover:text-black"
                                        >
                                            Complete Profile &rarr;
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <button
                                type="button"
                                onClick={handleCheckoutClick}
                                disabled={checkoutLoading || user?.profileCompleted === false || itemsList.some(item => {
                                    const prod = item.productId || {};
                                    let maxStock = 0;
                                    if (item.variantId && prod.variants) {
                                        const match = prod.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                        if (match) maxStock = match.stock || 0;
                                    } else {
                                        maxStock = prod.stock || 0;
                                    }
                                    return item.quantity > maxStock;
                                })}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer
                                    ${(user?.profileCompleted === false || itemsList.some(item => {
                                    const prod = item.productId || {};
                                    let maxStock = 0;
                                    if (item.variantId && prod.variants) {
                                        const match = prod.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                        if (match) maxStock = match.stock || 0;
                                    } else {
                                        maxStock = prod.stock || 0;
                                    }
                                    return item.quantity > maxStock;
                                }))
                                        ? 'bg-neutral-100 border border-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                                        : 'bg-black text-white hover:bg-neutral-900 hover:shadow-neutral-950/15 hover:-translate-y-0.5 active:scale-[0.98]'}`}
                            >
                                {checkoutLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout order
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-950">Delivery Address</h3>
                            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                                Enter your shipping details to complete the order.
                            </p>
                        </div>

                        <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">Street Address</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.addressLine}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                                    placeholder="Flat / House no, Apartment, Street"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-black transition-colors bg-neutral-50/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block mb-1.5">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        placeholder="City"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-black transition-colors bg-neutral-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block mb-1.5">State</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        placeholder="State"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-black transition-colors bg-neutral-50/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block mb-1.5">Postal Code</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.postalCode}
                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                    placeholder="PIN / ZIP code"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-black transition-colors bg-neutral-50/50"
                                />
                            </div>

                            {checkoutError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 font-bold text-center">
                                    {checkoutError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 border border-neutral-200 text-neutral-700 bg-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={checkoutLoading}
                                    className="flex-1 bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {checkoutLoading ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Placing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
