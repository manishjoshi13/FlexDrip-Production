import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../buyer/components/Navbar';
import { useIssue } from '../../buyer/hooks/useIssue';
import { MessageSquare, CheckCircle2, ClipboardList, AlertCircle, RefreshCw, Clock, Calendar, User, Mail, Phone, Tag } from 'lucide-react';

const SellerTickets = () => {
    const { getSellerTickets, resolveTicket, tickets, isLoading, error } = useIssue();

    useEffect(() => {
        getSellerTickets();
    }, []);

    const handleResolve = async (id) => {
        if (window.confirm("Are you sure you want to mark this support ticket as resolved? This will close the issue.")) {
            const result = await resolveTicket(id);
            if (!result.success) {
                alert(result.error || "Failed to resolve ticket");
            }
        }
    };

    // Calculate metrics
    const totalTickets = tickets ? tickets.length : 0;
    const openTicketsCount = tickets ? tickets.filter(t => t.status === 'OPEN').length : 0;
    const resolvedTicketsCount = tickets ? tickets.filter(t => t.status === 'CLOSED').length : 0;

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
                        <p className="text-sm text-neutral-550 font-medium">Review and resolve customer issues.</p>
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
                {isLoading && tickets.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Loading received tickets...</span>
                    </div>
                )}

                {/* Error Banner */}
                {!isLoading && error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800">Failed to fetch tickets</h4>
                                <p className="text-xs text-red-655 font-medium mt-0.5">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={getSellerTickets}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Metrics Cards */}
                {!isLoading && !error && tickets && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl text-neutral-800">
                                <MessageSquare className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Total Support Tickets</p>
                                <h3 className="text-2xl font-bold text-neutral-950 mt-0.5">{totalTickets}</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                <Clock className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Open Tickets</p>
                                <h3 className="text-2xl font-bold text-neutral-955 mt-0.5">{openTicketsCount}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Resolved Tickets</p>
                                <h3 className="text-2xl font-bold text-neutral-955 mt-0.5">{resolvedTicketsCount}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Tickets State */}
                {!isLoading && !error && tickets.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center py-20 text-center bg-white border border-neutral-200/50 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.015)]">
                        <ClipboardList className="w-10 h-10 text-neutral-400 mb-3 stroke-[1.5]" />
                        <h3 className="text-sm font-bold text-neutral-955">No Support Tickets received</h3>
                        <p className="text-xs text-neutral-550 font-medium mt-1.5 max-w-xs leading-relaxed">
                            Everything looks clean! Customers haven't raised any support tickets for your orders yet.
                        </p>
                    </div>
                )}

                {/* Tickets List */}
                {!isLoading && !error && tickets.length > 0 && (
                    <div className="space-y-8">
                        {tickets.map((ticket) => {
                            const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            // Filter items in the order that belong to this seller
                            const order = ticket.orderId || {};
                            const orderItems = order.items || [];

                            return (
                                <div key={ticket._id} className="bg-white rounded-3xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.01)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:border-neutral-300">
                                    {/* Ticket Header */}
                                    <div className="bg-neutral-50/50 border-b border-neutral-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <div>
                                                <span>Ticket Raised</span>
                                                <p className="text-neutral-900 font-bold mt-1 normal-case text-xs">{formattedDate}</p>
                                            </div>
                                            <div>
                                                <span>Ticket ID</span>
                                                <p className="text-neutral-900 font-mono mt-1 text-xs select-all">#{ticket._id}</p>
                                            </div>
                                            <div>
                                                <span>Associated Order</span>
                                                <p className="text-neutral-900 font-mono mt-1 text-xs select-all">#{order._id || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="px-2.5 py-0.5 rounded-full border border-neutral-200 text-neutral-600 bg-neutral-50 text-[9px] font-bold uppercase tracking-wider">
                                                {ticket.issueType.replace('_', ' ')}
                                            </span>

                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                                ticket.status === 'OPEN'
                                                    ? 'text-amber-600 border-amber-200 bg-amber-50'
                                                    : 'text-green-700 border-green-200 bg-green-50'
                                            }`}>
                                                {ticket.status === 'OPEN' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                {ticket.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer / Buyer Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 bg-neutral-50/20 border-b border-neutral-50 text-xs text-neutral-600">
                                        <div className="space-y-1.5 border-r border-neutral-100/50 pr-4 md:border-r md:border-b-0 pb-2 md:pb-0">
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Customer Information</span>
                                            <div className="flex items-center gap-2 font-bold text-neutral-850">
                                                <User className="w-3.5 h-3.5 text-neutral-450" />
                                                <span className="capitalize">{ticket.userId?.fullName || 'Anonymous'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{ticket.userId?.email || 'N/A'}</span>
                                            </div>
                                            {ticket.userId?.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                                    <span>{ticket.userId.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 flex flex-col justify-center">
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Order Status</span>
                                            <p className="font-bold text-neutral-850 capitalize text-xs">
                                                Current Status: <span className="underline decoration-neutral-350">{order.status || 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Issue Description Area */}
                                    <div className="px-6 py-5 bg-white border-b border-neutral-100">
                                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Problem Description</h4>
                                        <p className="text-xs text-neutral-850 leading-relaxed font-semibold bg-neutral-50 p-4 rounded-2xl border border-neutral-150 whitespace-pre-wrap">
                                            {ticket.description}
                                        </p>
                                    </div>

                                    {/* Items details */}
                                    {orderItems.length > 0 && (
                                        <div className="px-6 py-4.5 bg-neutral-50/10 border-b border-neutral-100">
                                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Items in this Order</h4>
                                            <div className="space-y-3">
                                                {orderItems.map((item, idx) => {
                                                    const product = item.productId || {};
                                                    let itemImage = product.images && product.images.length > 0 ? product.images[0].url : '';
                                                    if (item.variantId && product.variants) {
                                                        const match = product.variants.find(v => v._id === item.variantId || v.id === item.variantId);
                                                        if (match && match.images && match.images.length > 0) {
                                                            itemImage = match.images[0].url;
                                                        }
                                                    }

                                                    return (
                                                        <div key={idx} className="flex gap-4 items-center justify-between text-xs">
                                                            <div className="flex gap-3 items-center min-w-0">
                                                                <div className="w-10 h-13 bg-neutral-50 border border-neutral-200/50 rounded-lg overflow-hidden shrink-0">
                                                                    {itemImage ? (
                                                                        <img src={itemImage} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                            <Tag className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-neutral-900 uppercase truncate max-w-[200px]">{product.title || 'Product'}</p>
                                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-bold text-neutral-800">₹{Number(item.price).toLocaleString()} each</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="px-6 py-4.5 bg-neutral-50/20 flex justify-end">
                                        {ticket.status === 'OPEN' ? (
                                            <button
                                                onClick={() => handleResolve(ticket._id)}
                                                className="px-5 py-2.5 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                                            >
                                                Mark as Resolved
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="px-5 py-2.5 bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                                                Issue Resolved
                                            </button>
                                        )}
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

export default SellerTickets;
