import React, { useEffect, useState } from 'react';
import { useBuyer } from '../features/buyer/hooks/useBuyer';
import Navbar from '../features/buyer/components/Navbar';
import BuyerProductCard from '../features/buyer/components/BuyerProductCard';
import { 
    AlertCircle, 
    ArrowDown, 
    Shirt, 
    ArrowRight, 
    Sparkles,
    Search,
    X,
    CheckCircle2
} from 'lucide-react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const Home = () => {
    const { fetchProducts, fetchTrendingProducts, allProducts, isLoading, error } = useBuyer();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    
    // UI Filters and States
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileAlert, setShowProfileAlert] = useState(false);
    
    // Interactive philosophy modal state
    const [philosophyOpen, setPhilosophyOpen] = useState(false);

    // Sync selected tab with category search param from URL (e.g. from navbar side drawer)
    useEffect(() => {
        if (categoryParam) {
            const upperParam = categoryParam.toUpperCase();
            if (['OUTWEAR', 'FOOTWEAR', 'ACCESSORIES', 'ALL'].includes(upperParam)) {
                setSelectedTab(upperParam);
            }
        }
    }, [categoryParam]);
    
    // Inner Circle newsletter state
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(''); // '', 'success', 'error'
    const [subscriberName, setSubscriberName] = useState('');

    useEffect(() => {
        if (user && user.profileCompleted === false) {
            setShowProfileAlert(true);
        }
    }, [user]);

    useEffect(() => {
        fetchProducts();
        fetchTrendingProducts();
    }, []);

    const scrollToCatalog = () => {
        const element = document.getElementById('catalog-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setSubscriptionStatus('error');
            return;
        }
        setSubscriptionStatus('success');
        setSubscriberName(email.split('@')[0]);
        setTimeout(() => {
            setEmail('');
        }, 2000);
    };

    // Filter products dynamically based on selected tab and search query
    const filteredProducts = allProducts 
        ? allProducts.filter(product => {
            const matchesCategory = selectedTab === 'ALL' || product.category === selectedTab;
            const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        : [];

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans select-none antialiased text-neutral-900">
            {/* Profile Completion Alert Modal */}
            {showProfileAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-3">
                            <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-amber-600">
                                <AlertCircle className="w-7 h-7 stroke-[1.75]" />
                            </div>
                            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-950">Complete Your Profile</h3>
                            <p className="text-xs text-neutral-450 font-semibold leading-relaxed">
                                Welcome to FlexDrip! Please complete your profile details (add phone number & confirm account type) to enable shopping checkout features.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowProfileAlert(false);
                                    navigate('/profile');
                                }}
                                className="flex-grow bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors shadow-md cursor-pointer border-none"
                            >
                                Complete Now
                            </button>
                            <button
                                onClick={() => setShowProfileAlert(false)}
                                className="border border-neutral-200 text-neutral-500 bg-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                Remind Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Philosophy Dialog Modal */}
            {philosophyOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-350">
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-6 sm:p-8 max-w-lg w-full relative space-y-6 animate-in zoom-in-95 duration-250">
                        <button 
                            onClick={() => setPhilosophyOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-black cursor-pointer border-none bg-transparent"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="space-y-4">
                            <span className="text-[10px] font-extrabold tracking-[0.25em] text-neutral-400 uppercase">Our Philosophy</span>
                            <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider uppercase text-neutral-950">Engineered for the Urban Void</h3>
                            <div className="w-12 h-[2px] bg-black" />
                            
                            <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
                                FlexDrip represents an architectural, structural response to modern environments. We conceive garments as wearable structures that shield, flex, and define silhouettes in high-density urban spaces.
                            </p>
                            
                            <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
                                Every collection is strictly limited, prioritizing heavy organic textiles, technical custom-dyed waterproof weaves, and zero-compromise utility hardware. We reject fast trends to engineer modular, timeless assets.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setPhilosophyOpen(false)}
                                className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer border-none"
                            >
                                Acknowledge Philosophy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <Navbar />

            {/* Seller Warning Panel */}
            {user?.role === 'seller' && (
                <div className="bg-amber-50 border border-amber-100/60 px-5 py-3.5 flex items-center justify-between text-xs text-amber-800 font-semibold max-w-7xl mx-auto w-full mt-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
                    <span className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        You are logged in as a Merchant. Switch to the seller dashboard to manage listings.
                    </span>
                    <NavLink to="/seller" className="underline hover:text-amber-900 shrink-0 flex items-center gap-1">
                        Seller Panel <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg]" />
                    </NavLink>
                </div>
            )}

            {/* Premium Editorial Hero Section */}
            <header className="relative bg-neutral-900 h-[80vh] flex items-center justify-start overflow-hidden">
                {/* Background Banner */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/architectural_streetwear_hero.png" 
                        alt="Architectural Streetwear Essentials" 
                        className="w-full h-full object-cover opacity-80 filter brightness-[0.7] saturate-[0.8] transition-transform duration-10000 hover:scale-[1.03]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-transparent to-transparent" />
                </div>

                {/* Hero Content Area */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 w-full text-left">
                    <div className="max-w-xl space-y-6 animate-in slide-in-from-bottom-6 duration-700">
                        <span className="inline-block text-[11px] font-extrabold tracking-[0.3em] uppercase text-neutral-300">
                            Essentials Drop
                        </span>
                        
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                            Architectural <br />
                            <span className="text-neutral-200">
                                Streetwear.
                            </span>
                        </h1>
                        
                        <div className="pt-4 flex flex-wrap gap-4">
                            <button
                                onClick={scrollToCatalog}
                                className="group flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-850 active:scale-[0.98] transition-all cursor-pointer shadow-lg border-none"
                            >
                                New Collection
                                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform duration-200" />
                            </button>
                            
                            <button
                                onClick={() => {
                                    setSelectedTab('OUTWEAR');
                                    scrollToCatalog();
                                }}
                                className="inline-flex items-center justify-center border border-white/40 hover:border-white text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer bg-transparent"
                            >
                                Shop Essentials
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Shop by Line Section */}
            <section className="py-24 bg-white border-b border-neutral-100/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="flex items-end justify-between border-b border-neutral-100 pb-5">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-widest uppercase text-neutral-950 relative inline-block">
                                Shop by Line
                                <span className="block h-[2.5px] bg-black w-8 mt-2" />
                            </h2>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedTab('ALL');
                                scrollToCatalog();
                            }}
                            className="text-[10px] font-extrabold text-neutral-450 uppercase tracking-widest hover:text-black transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Explore All
                        </button>
                    </div>
                    
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Left Main Card: Kinetic Series */}
                        <div 
                            onClick={() => {
                                setSelectedTab('FOOTWEAR');
                                scrollToCatalog();
                            }}
                            className="lg:col-span-3 relative rounded-3xl overflow-hidden group aspect-[5/4] md:aspect-auto md:h-[500px] cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
                        >
                            <img 
                                src="/kinetic_series.png" 
                                alt="The Kinetic Series Shoes" 
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300" />
                            <div className="absolute bottom-8 left-8 text-white space-y-1">
                                <h3 className="text-lg font-bold tracking-widest uppercase">The Kinetic Series</h3>
                                <p className="text-[9px] text-neutral-300 font-extrabold uppercase tracking-widest">*Performance Engineered</p>
                            </div>
                        </div>

                        {/* Right Stack: Core Essentials & Elemental Shield */}
                        <div className="lg:col-span-2 flex flex-col gap-6 h-[500px]">
                            {/* Top Card: Core Essentials */}
                            <div 
                                onClick={() => {
                                    setSelectedTab('OUTWEAR');
                                    scrollToCatalog();
                                }}
                                className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
                            >
                                <img 
                                    src="/core_essentials.png" 
                                    alt="Core Essentials Flat Lay" 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-sm font-bold tracking-widest uppercase">Core Essentials</h3>
                                </div>
                            </div>

                            {/* Bottom Card: Elemental Shield */}
                            <div 
                                onClick={() => {
                                    setSelectedTab('ACCESSORIES');
                                    scrollToCatalog();
                                }}
                                className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
                            >
                                <img 
                                    src="/elemental_shield.png" 
                                    alt="Elemental Shield Rain Techwear" 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-sm font-bold tracking-widest uppercase">Elemental Shield</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Catalog Grid Section */}
            <section id="catalog-section" className="bg-[#fcfcfb] border-b border-neutral-200/25 py-24 w-full flex-grow">
                <main className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
                    {/* Catalog Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-neutral-100 pb-6">
                        <div>
                            <span className="text-[9.5px] font-extrabold tracking-[0.25em] text-neutral-400 uppercase">Curated Catalog</span>
                            <h2 className="text-xl font-bold tracking-wider uppercase text-neutral-950 mt-1 flex items-center gap-2">
                                {selectedTab === 'ALL' ? 'All Items' : selectedTab} Collection
                            </h2>
                        </div>
                        
                        {/* Dynamic Category Filtering Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {['ALL', 'OUTWEAR', 'FOOTWEAR', 'ACCESSORIES'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer
                                        ${selectedTab === tab 
                                            ? 'bg-black text-white' 
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Local In-Catalog Search Bar (fully functional) */}
                    <div className="max-w-md relative">
                        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            id="catalog-search-input"
                            type="text"
                            placeholder="Search catalog products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-neutral-200 hover:border-neutral-350 focus:border-black transition-all rounded-full py-3 pl-12 pr-6 text-xs font-semibold uppercase tracking-wider outline-none placeholder:text-neutral-400 placeholder:normal-case placeholder:tracking-normal"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-neutral-450 hover:text-black p-0.5 rounded-full hover:bg-neutral-100 cursor-pointer border-none bg-transparent"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800">Connection Error</h4>
                                <p className="text-xs text-red-600 font-semibold mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Products Grid / Skeletons */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-4 animate-pulse">
                                    <div className="aspect-[3/4] bg-neutral-100 rounded-2xl w-full" />
                                    <div className="space-y-2">
                                        <div className="h-3 bg-neutral-100 rounded-md w-1/4" />
                                        <div className="h-3.5 bg-neutral-100 rounded-md w-3/4" />
                                        <div className="h-3 bg-neutral-100 rounded-md w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-24 text-center border border-neutral-100 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.005)]">
                            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
                                <Shirt className="w-7 h-7 stroke-[1.25] text-neutral-800" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">Collection Empty</h3>
                            <p className="text-xs text-neutral-450 font-semibold mt-1.5 max-w-xs leading-relaxed">
                                No items found matching the selected capsule filter or search criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.map((product) => (
                                <BuyerProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </section>

            {/* Dark Philosophy Poster Section */}
            <section className="bg-neutral-950 text-white py-24 flex flex-col items-center text-center">
                <div className="max-w-2xl px-6 space-y-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-[0.3em] uppercase leading-snug">
                        Engineered for the Urban Void
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
                        FlexDrip isn't just apparel; it's a structural response to the modern environment. High-performance fabrics meet minimalist silhouettes for those who navigate the architecture of the city.
                    </p>
                    
                    <div className="pt-4">
                        <button 
                            onClick={() => setPhilosophyOpen(true)}
                            className="bg-white text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-md border-none"
                        >
                            Our Philosophy
                        </button>
                    </div>
                </div>
            </section>

            {/* Join the Inner Circle Section */}
            <section className="py-24 bg-white border-b border-neutral-100/50">
                <div className="max-w-md mx-auto px-6 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-neutral-950">
                            Join the Inner Circle
                        </h2>
                        <p className="text-xs text-neutral-450 font-semibold leading-relaxed">
                            Receive exclusive access to seasonal drops and architectural insights.
                        </p>
                    </div>

                    {/* Email Newsletter form (fully functional locally) */}
                    <form onSubmit={handleSubscribe} className="space-y-4">
                        <div className="relative border-b border-neutral-350 pb-2 flex items-center">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (subscriptionStatus) setSubscriptionStatus('');
                                }}
                                className="w-full bg-transparent text-xs font-bold uppercase tracking-wider py-1 outline-none border-none placeholder:text-neutral-400"
                                required
                            />
                            <button
                                type="submit"
                                className="text-[10px] font-extrabold text-neutral-950 uppercase tracking-widest hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer pl-4 py-1"
                            >
                                Subscribe
                            </button>
                        </div>
                        
                        {subscriptionStatus === 'success' && (
                            <div className="flex items-center justify-center gap-2 p-3 bg-neutral-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                Welcome, {subscriberName}! Access Code sent.
                            </div>
                        )}
                        {subscriptionStatus === 'error' && (
                            <div className="p-3 bg-red-50 text-red-650 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
                                Please enter a valid email address.
                            </div>
                        )}
                    </form>
                </div>
            </section>

            {/* Premium Editorial Multi-column Footer */}
            <footer className="bg-neutral-950 text-white py-20 border-t border-neutral-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Column 1: Brand Info */}
                        <div className="space-y-4 text-left">
                            <h3 className="text-base font-extrabold tracking-[0.3em] uppercase">FLEXDRIP</h3>
                            <p className="text-xs text-neutral-450 font-semibold leading-relaxed max-w-xs">
                                High-performance digital boutique specializing in architectural streetwear and technical essentials.
                            </p>
                        </div>

                        {/* Column 2: Collections */}
                        <div className="space-y-4 text-left">
                            <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-200">Collections</h4>
                            <ul className="space-y-2.5 text-xs text-neutral-450 font-semibold uppercase tracking-wider list-none p-0 m-0">
                                <li>
                                    <button 
                                        onClick={() => { setSelectedTab('ALL'); scrollToCatalog(); }}
                                        className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left font-semibold"
                                    >
                                        New Arrivals
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => { setSelectedTab('OUTWEAR'); scrollToCatalog(); }}
                                        className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left font-semibold"
                                    >
                                        Outwear
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => { setSelectedTab('FOOTWEAR'); scrollToCatalog(); }}
                                        className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left font-semibold"
                                    >
                                        Footwear
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => { setSelectedTab('ACCESSORIES'); scrollToCatalog(); }}
                                        className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left font-semibold"
                                    >
                                        Accessories
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Support */}
                        <div className="space-y-4 text-left">
                            <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-200">Support</h4>
                            <ul className="space-y-2.5 text-xs text-neutral-450 font-semibold uppercase tracking-wider list-none p-0 m-0">
                                <li><a href="#" className="hover:text-white transition-colors no-underline">Shipping</a></li>
                                <li><a href="#" className="hover:text-white transition-colors no-underline">Returns</a></li>
                                <li><a href="#" className="hover:text-white transition-colors no-underline">Size Guide</a></li>
                                <li><a href="#" className="hover:text-white transition-colors no-underline">Contact</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Social */}
                        <div className="space-y-4 text-left">
                            <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-200">Social</h4>
                            <ul className="space-y-2.5 text-xs text-neutral-450 font-semibold uppercase tracking-wider list-none p-0 m-0">
                                <li><a href="#" className="hover:text-white transition-colors no-underline">Instagram</a></li>
                                <li><a href="#" className="hover:text-white transition-colors no-underline">TikTok</a></li>
                                <li><a href="#" className="hover:text-white transition-colors no-underline">X / Twitter</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider and Copyright */}
                    <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors no-underline">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors no-underline">Terms of Service</a>
                        </div>
                        <p>© 2026 FLEXDRIP. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
