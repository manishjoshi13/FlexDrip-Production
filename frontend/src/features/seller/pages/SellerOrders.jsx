import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../buyer/components/Navbar';
import { useOrder } from '../../buyer/hooks/useOrder';
import { ClipboardList, Truck, CheckCircle2, Package, Tag, AlertCircle, RefreshCw, Clock, XCircle, MapPin, User, Mail, Phone, DollarSign, Layers } from 'lucide-react';

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

const SellerOrders = () => {
    const { getSellerOrders, updateOrderStatus, orders, isLoading, error } = useOrder();

    useEffect(() => {
        getSellerOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        if (window.confirm(`Update order status to: ${newStatus.toUpperCase()}?`)) {
            const result = await updateOrderStatus(orderId, newStatus);
            if (!result.success) {
                alert(result.error || "Failed to update order status");
            }
        }
    };

    // Calculate metrics
    const totalOrders = orders ? orders.length : 0;
    const totalEarnings = orders
        ? orders.reduce((sum, order) => {
              if (order.status === 'cancelled') return sum;
              const orderTotal = order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
              return sum + orderTotal;
          }, 0)
        : 0;

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-grow">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200/50 pb-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                            <span>Seller Dashboard</span>
                            <span>/</span>
                            <NavLink to="/" className="hover:text-black transition-colors underline decoration-neutral-350 hover:decoration-black">Go to Home Storefront</NavLink>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 mb-1">Seller Hub</h1>
                        <p className="text-sm text-neutral-550 font-medium">View customer orders and dispatch status updates.</p>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-neutral-200 mb-8">
                    <NavLink
                        to="/seller"
                        end
                        className={({ isActive }) =>
                            `px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                isActive
                                    ? 'border-black text-black'
                                    : 'border-transparent text-neutral-400 hover:text-black'
                            }`
                        }
                    >
                        Products Catalog
                    </NavLink>
                    <NavLink
                        to="/seller/orders"
                        className={({ isActive }) =>
                            `px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                isActive
                                    ? 'border-black text-black'
                                    : 'border-transparent text-neutral-400 hover:text-black'
                            }`
                        }
                    >
                        Received Orders
                    </NavLink>
                    <NavLink
                        to="/seller/tickets"
                        className={({ isActive }) =>
                            `px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                isActive
                                    ? 'border-black text-black'
                                    : 'border-transparent text-neutral-400 hover:text-black'
                            }`
                        }
                    >
                        Support Tickets
                    </NavLink>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Loading received orders...</span>
                    </div>
                )}

                {/* Error Banner */}
                {!isLoading && error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800">Failed to fetch orders</h4>
                                <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={getSellerOrders}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Metrics Cards */}
                {!isLoading && !error && orders && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl text-neutral-800">
                                <Layers className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Total Received Orders</p>
                                <h3 className="text-2xl font-bold text-neutral-950 mt-0.5">{totalOrders}</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl text-neutral-800">
                                <DollarSign className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Earnings (Excl. Cancelled)</p>
                                <h3 className="text-2xl font-bold text-neutral-950 mt-0.5">
                                    ₹{totalEarnings.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Orders State */}
                {!isLoading && !error && orders.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center py-20 text-center bg-white border border-neutral-200/50 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.015)]">
                        <ClipboardList className="w-10 h-10 text-neutral-400 mb-3 stroke-[1.5]" />
                        <h3 className="text-sm font-bold text-neutral-950">No orders received</h3>
                        <p className="text-xs text-neutral-550 font-medium mt-1.5 max-w-xs leading-relaxed">
                            You haven't received any orders yet. Once customer orders are placed, they will appear here.
                        </p>
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
                            const orderTotalForSeller = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                            return (
                                <div key={order._id} className="bg-white rounded-3xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.01)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:border-neutral-300">
                                    {/* Order Header / Meta */}
                                    <div className="bg-neutral-50/50 border-b border-neutral-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <div>
                                                <span>Placed On</span>
                                                <p className="text-neutral-900 font-bold mt-1 normal-case text-xs">{formattedDate}</p>
                                            </div>
                                            <div>
                                                <span>Order ID</span>
                                                <p className="text-neutral-900 font-mono mt-1 text-xs select-all">#{order._id}</p>
                                            </div>
                                            <div>
                                                <span>Earning on Order</span>
                                                <p className="text-neutral-900 font-extrabold mt-1 text-xs">₹{orderTotalForSeller.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Status Selector Dropdown */}
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Update Status:</span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="bg-white border border-neutral-200 text-neutral-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-neutral-400 cursor-pointer uppercase tracking-wider"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>

                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buyer Details & Shipping Address */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 bg-neutral-50/20 border-b border-neutral-50 text-xs text-neutral-600">
                                        {/* Buyer info */}
                                        <div className="space-y-1.5 border-r border-neutral-100/50 pr-4 md:border-r-1 md:border-b-0 pb-2 md:pb-0">
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Customer Info</span>
                                            <div className="flex items-center gap-2 font-bold text-neutral-850">
                                                <User className="w-3.5 h-3.5 text-neutral-450" />
                                                <span className="capitalize">{order.user?.fullName || 'Anonymous'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{order.user?.email || 'N/A'}</span>
                                            </div>
                                            {order.user?.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                                    <span>{order.user.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Address Info */}
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Shipping Details</span>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-neutral-800">{order.shippingAddress?.addressLine}</p>
                                                    <p className="text-neutral-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items details */}
                                    <div className="divide-y divide-neutral-100 px-6 bg-white">
                                        {order.items.map((item, idx) => {
                                            const product = item.productId || {};
                                            
                                            // Extract variant attributes label
                                            let variantLabel = '';
                                            if (item.variantId && product.variants) {
                                                const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                                if (match?.attributes) {
                                                    variantLabel = Object.entries(match.attributes)
                                                        .map(([k, val]) => `${k}: ${val}`)
                                                        .join(' / ');
                                                }
                                            }

                                            // Extract variant image
                                            let itemImage = product.images && product.images.length > 0 ? product.images[0].url : '';
                                            if (item.variantId && product.variants) {
                                                const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                                if (match && match.images && match.images.length > 0) {
                                                    itemImage = match.images[0].url;
                                                }
                                            }

                                            return (
                                                <div key={idx} className="py-4.5 flex gap-4 items-center justify-between">
                                                    <div className="flex gap-4 items-center min-w-0">
                                                        <div className="w-14 h-18 bg-neutral-50 border border-neutral-150 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                                            {itemImage ? (
                                                                <img src={itemImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                    <Tag className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs font-bold text-neutral-900 truncate uppercase tracking-wider">
                                                                {product.title || 'Product'}
                                                            </h4>
                                                            {variantLabel && (
                                                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                                                                    {variantLabel}
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] font-bold text-neutral-450 block mt-1 uppercase tracking-wide">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="text-xs font-bold text-neutral-800">
                                                            ₹{Number(item.price).toLocaleString()} each
                                                        </span>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                                                            Earnings: ₹{(Number(item.price) * item.quantity).toLocaleString()}
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
            </main>
        </div>
    );
};

export default SellerOrders;
