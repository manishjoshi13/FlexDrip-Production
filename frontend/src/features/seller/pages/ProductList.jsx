import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Navbar from '../../buyer/components/Navbar';
import { Plus, Search, SlidersHorizontal, AlertCircle, RefreshCw, Layers, DollarSign } from 'lucide-react';

const ProductList = () => {
    const navigate = useNavigate();
    const { isLoading, error, myProducts, getMyProducts, deleteProduct } = useProduct();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        getMyProducts();
    }, []);

    const handleEdit = (product) => {
        navigate(`/seller/products/edit/${product._id || product.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            await deleteProduct(id);
        }
    };

    // Metric Calculations
    const totalProducts = myProducts ? myProducts.length : 0;
    
    // Group average price by currency, or do simple average
    const averagePrice = totalProducts > 0 
        ? Math.round(myProducts.reduce((acc, p) => acc + (p.price?.amount || 0), 0) / totalProducts)
        : 0;

    // Filter and Sort logic
    const filteredAndSortedProducts = myProducts
        ? [...myProducts]
            .filter(product => {
                const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
                const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase());
                return titleMatch || descMatch;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (sortBy === 'oldest') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }
                if (sortBy === 'price-asc') {
                    return (a.price?.amount || 0) - (b.price?.amount || 0);
                }
                if (sortBy === 'price-desc') {
                    return (b.price?.amount || 0) - (a.price?.amount || 0);
                }
                if (sortBy === 'alpha') {
                    return a.title?.localeCompare(b.title);
                }
                return 0;
            })
        : [];

    const handleAddProductClick = () => {
        navigate('/seller/products/new');
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            {/* Navbar */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-grow">
                {/* Upper Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200/50 pb-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                            <span>Seller Dashboard</span>
                            <span>/</span>
                            <NavLink to="/" className="hover:text-black transition-colors underline decoration-neutral-350 hover:decoration-black">Go to Home Storefront</NavLink>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 mb-1">My Catalog</h1>
                        <p className="text-sm text-neutral-550 font-medium">Manage and monitor all your product listings in one place.</p>
                    </div>
                    <button
                        onClick={handleAddProductClick}
                        className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Add New Product
                    </button>
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

                {/* Metrics Dashboard Cards */}
                {!isLoading && myProducts && myProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl text-neutral-800">
                                <Layers className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Total Listings</p>
                                <h3 className="text-2xl font-bold text-neutral-950 mt-0.5">{totalProducts}</h3>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)] flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-xl text-neutral-800">
                                <DollarSign className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Average Price</p>
                                <h3 className="text-2xl font-bold text-neutral-950 mt-0.5">
                                    ₹{averagePrice.toLocaleString()} <span className="text-xs font-semibold text-neutral-400">(INR Avg)</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State Banner */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800">Unable to load products</h4>
                                <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={getMyProducts}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry Load
                        </button>
                    </div>
                )}

                {/* Filter Toolbar */}
                {!isLoading && myProducts && myProducts.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.015)]">
                        {/* Search */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search catalog by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-200 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-neutral-400 placeholder:font-normal"
                            />
                        </div>

                        {/* Sorting */}
                        <div className="flex items-center gap-2 shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-neutral-200 text-neutral-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 cursor-pointer"
                            >
                                <option value="newest">Newest Added</option>
                                <option value="oldest">Oldest Added</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="alpha">Alphabetical (A-Z)</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Main Products List Area */}
                {isLoading ? (
                    // Skeletons
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-neutral-100/30 overflow-hidden shadow-sm p-3 space-y-3 animate-pulse">
                                <div className="aspect-[3/4] bg-neutral-100 rounded-xl w-full" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-neutral-100 rounded-md w-3/4" />
                                    <div className="h-2.5 bg-neutral-100 rounded-md w-full" />
                                </div>
                                <div className="pt-2 border-t border-neutral-50 flex justify-between">
                                    <div className="h-3 bg-neutral-100 rounded-md w-1/4" />
                                    <div className="h-3 bg-neutral-100 rounded-md w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !myProducts || myProducts.length === 0 ? (
                    // Initial empty state
                    <EmptyState onAddClick={handleAddProductClick} />
                ) : filteredAndSortedProducts.length === 0 ? (
                    // Search empty state
                    <div className="w-full flex flex-col items-center justify-center py-16 text-center bg-white border border-neutral-200/50 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.015)]">
                        <AlertCircle className="w-8 h-8 text-neutral-450 mb-3 stroke-[1.5]" />
                        <h3 className="text-sm font-bold text-neutral-950">No matching results</h3>
                        <p className="text-xs text-neutral-550 font-medium mt-1 max-w-xs leading-relaxed">
                            We couldn't find any products matching "{searchTerm}". Try checking for spelling errors or adjusting filters.
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-xs font-bold text-black hover:underline cursor-pointer"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    // Products Grid
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredAndSortedProducts.map((product) => (
                            <ProductCard 
                                key={product._id || product.id} 
                                product={product} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductList;
