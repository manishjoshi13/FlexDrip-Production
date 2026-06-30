import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ClipboardList, ArrowRight, Truck, CheckCircle2, Package, Tag, ArrowLeft, AlertCircle, RefreshCw, Clock, XCircle, MapPin, MessageSquare, Calendar, X } from 'lucide-react';
import { useOrder } from '../hooks/useOrder';
import { useIssue } from '../hooks/useIssue';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const statusStyles = {
    pending: {
        color: 'text-amber-600 border-amber-200 bg-amber-50',
        icon: Clock
    },
    paid: {
        color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
        icon: CheckCircle2
    },
    shipped: {
        color: 'text-blue-600 border-blue-200 bg-blue-50',
        icon: Truck
    },
    delivered: {
        color: 'text-green-700 border-green-200 bg-green-50',
        icon: CheckCircle2
    },
    cancelled: {
        color: 'text-red-600 border-red-200 bg-red-50',
        icon: XCircle
    }
};

const OrdersPage = () => {
    const navigate = useNavigate();
    const { getMyOrders, cancelOrder, orders, isLoading, error } = useOrder();
    const { tickets, getMyTickets, createTicket, isLoading: isIssueLoading, error: issueError } = useIssue();

    const [activeTab, setActiveTab] = useState('orders');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [issueType, setIssueType] = useState('OTHER');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (activeTab === 'orders') {
            getMyOrders();
        } else if (activeTab === 'tickets') {
            getMyTickets();
        }
    }, [activeTab]);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this order? This will restore the items back to inventory.")) {
            await cancelOrder(id);
        }
    };

    const openRaiseTicketModal = (order) => {
        setSelectedOrder(order);
        setIssueType('OTHER');
        setDescription('');
        setFormError('');
        setIsModalOpen(true);
    };

    const handleRaiseTicketSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!description.trim()) {
            setFormError("Please enter a description of the problem.");
            return;
        }

        setIsSubmitting(true);
        const result = await createTicket({
            orderId: selectedOrder._id,
            issueType,
            description: description.trim()
        });
        setIsSubmitting(false);

        if (result.success) {
            setIsModalOpen(false);
            setActiveTab('tickets');
        } else {
            setFormError(result.error || "Failed to raise support ticket");
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between border-b border-neutral-200/50 pb-6">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="group inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider mb-2 cursor-pointer border-none bg-transparent"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Store
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                            {activeTab === 'orders' ? 'My Orders' : 'Support Tickets'}
                        </h1>
                        <p className="text-xs text-neutral-550 font-medium mt-1">
                            {activeTab === 'orders' 
                                ? 'Track and review your purchase history.' 
                                : 'View and track issues raised on your active orders.'}
                        </p>
                    </div>
                    <div className="p-2.5 bg-neutral-100 rounded-xl">
                        <ClipboardList className="w-5 h-5 text-neutral-800" />
                    </div>
                </div>

                {/* Split Navigation Tabs */}
                <div className="flex border-b border-neutral-200 mb-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === 'orders'
                                ? 'border-black text-black border-b-2'
                                : 'border-transparent text-neutral-400 hover:text-black'
                        }`}
                    >
                        My Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === 'tickets'
                                ? 'border-black text-black border-b-2'
                                : 'border-transparent text-neutral-400 hover:text-black'
                        }`}
                    >
                        Support Tickets
                    </button>
                </div>

                {/* Tab: Orders List */}
                {activeTab === 'orders' && (
                    <>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                                <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Loading Orders...</span>
                            </div>
                        )}

                        {/* Error Banner */}
                        {!isLoading && error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-800">Failed to load orders</h4>
                                        <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={getMyOrders}
                                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* No Orders State */}
                        {!isLoading && !error && orders.length === 0 && (
                            <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-12 text-center max-w-lg mx-auto">
                                <div className="p-4 bg-neutral-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-6 h-6 text-neutral-400" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">No Orders Placed</h3>
                                <p className="text-xs text-neutral-400 font-medium mt-1.5 leading-relaxed">
                                    You haven't placed any orders yet. Visit the catalog to add items to your bag.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-6 inline-flex items-center gap-1.5 bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                    Shop Collection
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {/* Orders List */}
                        {!isLoading && !error && orders.length > 0 && (
                            <div className="space-y-8">
                                {orders.map((order) => {
                                    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    const statusInfo = statusStyles[order.status] || { color: 'text-neutral-500 bg-neutral-50 border-neutral-100', icon: Truck };
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <div key={order._id} className="bg-white rounded-3xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)] hover:border-neutral-300/80">
                                            {/* Order Header Info */}
                                            <div className="bg-neutral-50/50 border-b border-neutral-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold text-neutral-450 uppercase tracking-widest">
                                                    <div>
                                                        <span>Order Placed</span>
                                                        <p className="text-neutral-900 font-bold mt-1 normal-case text-xs">{formattedDate}</p>
                                                    </div>
                                                    <div>
                                                        <span>Order ID</span>
                                                        <p className="text-neutral-900 font-mono mt-1 text-xs select-all">#{order._id}</p>
                                                    </div>
                                                    <div>
                                                        <span>Status</span>
                                                        <div className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {order.status}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-4.5 sm:gap-6">
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Total Price</span>
                                                        <span className="text-base font-extrabold text-neutral-950 block mt-0.5">
                                                            ₹{Number(order.totalAmount).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancel(order._id)}
                                                            className="px-3.5 py-2 border border-red-200 text-red-655 hover:bg-red-50 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => openRaiseTicketModal(order)}
                                                            className="px-3.5 py-2 border border-black text-black hover:bg-black hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                                                        >
                                                            Raise Ticket
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Shipping Address Row */}
                                            {order.shippingAddress && (
                                                <div className="px-6 py-3 border-b border-neutral-50 bg-white/40 flex items-start gap-2.5">
                                                    <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                                                    <div className="text-[11px] font-medium text-neutral-500 leading-normal">
                                                        <span className="font-bold text-neutral-700 uppercase tracking-wider text-[9px] mr-1.5">Ship To:</span>
                                                        {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Order Items List */}
                                            <div className="divide-y divide-neutral-100 px-6 bg-white">
                                                {order.items.map((item, idx) => {
                                                    const product = item.productId || {};
                                                    
                                                    let variantLabel = '';
                                                    if (item.variantId && product.variants) {
                                                        const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                                        if (match?.attributes) {
                                                            variantLabel = Object.entries(match.attributes)
                                                                .map(([k, val]) => `${k}: ${val}`)
                                                                .join(' / ');
                                                        }
                                                    }

                                                    let itemImage = product.images && product.images.length > 0 ? product.images[0].url : '';
                                                    if (item.variantId && product.variants) {
                                                        const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                                        if (match && match.images && match.images.length > 0) {
                                                            itemImage = match.images[0].url;
                                                        }
                                                    }

                                                    return (
                                                        <div key={idx} className="py-4.5 flex gap-5 items-center justify-between">
                                                            <div className="flex gap-4 items-center min-w-0">
                                                                <div className="w-14 h-18 bg-neutral-50 border border-neutral-200/50 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                                                    {itemImage ? (
                                                                        <img src={itemImage} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-neutral-350 bg-neutral-50">
                                                                            <Tag className="w-4 h-4" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h4 
                                                                        onClick={() => product._id && navigate(`/product/${product._id}`)}
                                                                        className="text-xs font-bold text-neutral-900 truncate uppercase tracking-wider hover:underline cursor-pointer"
                                                                    >
                                                                        {product.title || 'Product'}
                                                                    </h4>
                                                                    {variantLabel && (
                                                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                                                                            {variantLabel}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[10px] font-bold text-neutral-455 block mt-1.5 uppercase tracking-wide">
                                                                        Qty: {item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-right shrink-0">
                                                                <span className="text-xs font-bold text-neutral-800">
                                                                    ₹{Number(item.price).toLocaleString()} each
                                                                </span>
                                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                                                                    Subtotal: ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* Tab: Support Tickets */}
                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        {/* Loading State */}
                        {isIssueLoading && tickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                                <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Loading Tickets...</span>
                            </div>
                        )}

                        {/* Error Banner */}
                        {!isIssueLoading && issueError && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-800">Failed to load support tickets</h4>
                                        <p className="text-xs text-red-655 font-medium mt-0.5">{issueError}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={getMyTickets}
                                    className="px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty Tickets */}
                        {!isIssueLoading && !issueError && tickets.length === 0 && (
                            <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-12 text-center max-w-lg mx-auto">
                                <div className="p-4 bg-neutral-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-6 h-6 text-neutral-400" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-sans">No Tickets Raised</h3>
                                <p className="text-xs text-neutral-400 font-medium mt-1.5 leading-relaxed">
                                    You have not raised any support tickets yet. If you face any issues with an in-progress order, click "Raise Ticket" on that order.
                                </p>
                            </div>
                        )}

                        {/* Tickets List */}
                        {!isIssueLoading && !issueError && tickets.length > 0 && (
                            <div className="space-y-6">
                                {tickets.map((ticket) => {
                                    const ticketDate = new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    return (
                                        <div key={ticket._id} className="bg-white rounded-3xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)] hover:border-neutral-300/80 p-6 space-y-4 font-sans">
                                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-neutral-450 uppercase tracking-wider">Ticket ID:</span>
                                                        <span className="text-xs font-mono font-bold text-neutral-905">#{ticket._id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Order ID:</span>
                                                        <span className="text-[10px] font-mono text-neutral-600">#{ticket.orderId?._id || 'N/A'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                                        ticket.status === 'OPEN'
                                                            ? 'text-amber-600 border-amber-200 bg-amber-50'
                                                            : 'text-emerald-700 border-emerald-200 bg-emerald-50'
                                                    }`}>
                                                        {ticket.status}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full border border-neutral-200 text-neutral-600 bg-neutral-50 text-[9px] font-bold uppercase tracking-wider">
                                                        {ticket.issueType.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Issue Description</span>
                                                <p className="text-xs text-neutral-800 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100 font-medium whitespace-pre-wrap">
                                                    {ticket.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                    <span>Raised on: {ticketDate}</span>
                                                </div>
                                                {ticket.sellerId && (
                                                    <div>
                                                        <span className="text-neutral-400">Merchant Partner:</span>{' '}
                                                        <span className="text-neutral-900 font-extrabold capitalize">{ticket.sellerId.fullName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Raise Ticket Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 p-6 sm:p-8 space-y-6 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-150 pb-4">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-neutral-950 uppercase font-sans">Raise Support Ticket</h3>
                                <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider mt-1">
                                    Order ID: #{selectedOrder._id}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-black rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                                <AlertCircle className="w-4 h-4 text-red-555 shrink-0" />
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleRaiseTicketSubmit} className="space-y-5">
                            {/* Issue Type */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Issue Category</label>
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-150 focus:border-neutral-300 focus:bg-white rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer transition-all uppercase tracking-wider text-xs"
                                >
                                    <option value="ORDER_ISSUE">Order Issue</option>
                                    <option value="PAYMENT_ISSUE">Payment Issue</option>
                                    <option value="DELIVERY_ISSUE">Delivery Issue</option>
                                    <option value="OTHER">Other Query</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">Describe your problem</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide details about the problem you are facing with this order..."
                                    rows={5}
                                    maxLength={1000}
                                    required
                                    className="w-full bg-neutral-50 border border-neutral-150 focus:border-neutral-300 focus:bg-white rounded-xl py-3 px-4 text-sm font-medium outline-none resize-none transition-all placeholder:text-neutral-400"
                                />
                                <div className="text-[9px] text-neutral-400 font-medium text-right">
                                    {description.length}/1000 characters
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-3 border border-neutral-250 hover:bg-neutral-50 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Ticket'
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

export default OrdersPage;
