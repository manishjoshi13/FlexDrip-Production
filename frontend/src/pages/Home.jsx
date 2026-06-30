import React, { useEffect, useState } from 'react';
import { useBuyer } from '../features/buyer/hooks/useBuyer';
import Navbar from '../features/buyer/components/Navbar';
import BuyerProductCard from '../features/buyer/components/BuyerProductCard';
import { 
    AlertCircle, 
    ArrowDown, 
    Shirt, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    ArrowRight, 
    Sparkles, 
    Flame, 
    Layers, 
    Crown, 
    Glasses,
    ArrowUpRight,
    TrendingUp,
    Compass
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const Home = () => {
    const { fetchProducts, fetchTrendingProducts, allProducts, trendingProducts, isLoading, error } = useBuyer();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [showProfileAlert, setShowProfileAlert] = useState(false);

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
    
    // Categories matching database category values with styling
    const categories = [
        { id: 'ALL', name: 'All In', Icon: Compass, desc: 'Complete Drop' },
        { id: 'TRENDING', name: 'Trending', Icon: Flame, desc: 'Hot Picks' },
        { id: 'SHIRTS', name: 'Shirts', Icon: Shirt, desc: 'Oversized Tees' },
        { id: 'DENIM', name: 'Denim', Icon: Layers, desc: 'Utility Jeans' },
        { id: 'ESSENTIALS', name: 'Essentials', Icon: Crown, desc: 'Premium Basics' },
        { id: 'ACCESSORIES', name: 'Accessories', Icon: Glasses, desc: 'Urban Accents' }
    ];

    // Filter products dynamically based on selected tab matching backend product.category
    const filteredProducts = allProducts 
        ? allProducts.filter(product => {
            if (selectedTab === 'ALL') return true;
            if (selectedTab === 'TRENDING') return false;
            return product.category === selectedTab;
        })
        : [];

    const displayProducts = selectedTab === 'TRENDING' ? trendingProducts : filteredProducts;

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
                            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
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
                        Seller Panel <ArrowUpRight className="w-3.5 h-3.5" />
                    </NavLink>
                </div>
            )}

            {/* Premium Editorial Hero Section */}
            <header className="relative bg-neutral-950 h-[80vh] flex items-center justify-start overflow-hidden">
                {/* Background Banner */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/fashion_hero_banner.png" 
                        alt="Summer Collection" 
                        className="w-full h-full object-cover opacity-80 filter brightness-[0.6] saturate-[0.85] transition-transform duration-10000 hover:scale-[1.05]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                </div>

                {/* Hero Content Area */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 w-full text-left">
                    <div className="max-w-xl space-y-6 animate-in slide-in-from-bottom-6 duration-700">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase text-white/90">
                            <Sparkles className="w-3 h-3 text-amber-300" /> Drop '26 / Escape Core
                        </span>
                        
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                            THE ART OF <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-neutral-100 to-amber-100">
                                MINIMALISM
                            </span>
                        </h1>
                        
                        <p className="text-xs sm:text-sm text-neutral-350 font-medium leading-relaxed max-w-md">
                            Experience structured streetwear silhouettes, heavy organic fabrics, and custom-dyed earth tones crafted for a timeless modern capsule.
                        </p>
                        
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={scrollToCatalog}
                                className="group flex items-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 active:scale-[0.98] transition-all cursor-pointer shadow-lg hover:shadow-white/5"
                            >
                                Shop Drop
                                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform duration-200" />
                            </button>
                            
                            <a
                                href="#lookbook"
                                className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Editorial
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Category Track (Overhauled Category Section) */}
            <section className="py-16 bg-white border-b border-neutral-100/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-sm mx-auto mb-10">
                        <span className="text-[10px] font-bold tracking-[0.25em] text-amber-600 uppercase">Curated Capsules</span>
                        <h2 className="text-xl font-bold tracking-wider uppercase text-neutral-950 mt-1">Shop by Line</h2>
                        <div className="w-10 h-[1.5px] bg-neutral-950 mx-auto mt-2" />
                    </div>
                    
                    {/* Premium Grid Categories buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-2">
                        {categories.map((cat) => {
                            const isSelected = selectedTab === cat.id;
                            const Icon = cat.Icon;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedTab(cat.id);
                                        scrollToCatalog();
                                    }}
                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group cursor-pointer text-center relative overflow-hidden
                                        ${isSelected 
                                            ? 'bg-black border-black text-white shadow-xl shadow-black/5 -translate-y-1' 
                                            : 'bg-[#fafaf9] border-neutral-200/50 hover:bg-white hover:border-black/50 hover:shadow-md hover:-translate-y-0.5'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-300
                                        ${isSelected ? 'bg-white text-black' : 'bg-neutral-100 text-neutral-800 group-hover:bg-black group-hover:text-white'}`}>
                                        <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-widest uppercase block">
                                        {cat.name}
                                    </span>
                                    <span className={`text-[8px] font-medium uppercase tracking-wider block mt-0.5
                                        ${isSelected ? 'text-amber-200' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                                        {cat.desc}
                                    </span>
                                    
                                    {isSelected && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-200 to-amber-100" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Catalog Grid Section */}
            <section id="catalog-section" className="bg-[#fcfcfb] border-b border-neutral-200/25 py-20 w-full flex-grow">
                <main className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Catalog Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-100 pb-6 mb-10">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Storefront Catalog</span>
                            <h2 className="text-xl font-bold tracking-wider uppercase text-neutral-950 mt-1 flex items-center gap-2">
                                {categories.find(c => c.id === selectedTab)?.name || 'ALL'} Collection
                                {selectedTab === 'TRENDING' && <TrendingUp className="w-5 h-5 text-amber-500" />}
                            </h2>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">
                            Showing {displayProducts.length} Items
                        </span>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800">Connection Error</h4>
                                <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Products Grid / Skeletons */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                    ) : displayProducts.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-24 text-center border border-neutral-100 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
                                <Shirt className="w-7 h-7 stroke-[1.25] text-neutral-800" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">Collection Empty</h3>
                            <p className="text-xs text-neutral-400 font-medium mt-1.5 max-w-xs leading-relaxed">
                                No items currently available in the selected capsule collection.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {displayProducts.map((product) => (
                                <BuyerProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </section>

            {/* Premium Lookbook Poster Section */}
            <section id="lookbook" className="py-16 bg-white border-b border-neutral-100/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden h-[50vh] bg-neutral-900 shadow-2xl flex items-center p-8 sm:p-16">
                        {/* Background Poster Image */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src="/fashion_editorial_poster.png" 
                                alt="Editorial Couture" 
                                className="w-full h-full object-cover opacity-75 object-[center_30%] transition-transform duration-1000 hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="relative z-10 max-w-md text-white">
                            <div className="backdrop-blur-md bg-black/35 border border-white/10 p-8 sm:p-10 rounded-3xl space-y-4 shadow-xl">
                                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-200 block">Editorial Capsule</span>
                                <h3 className="text-xl sm:text-3xl font-extrabold tracking-widest uppercase leading-snug">
                                    THE EDITORIAL COUTURE
                                </h3>
                                <p className="text-[11px] text-neutral-350 leading-relaxed font-semibold">
                                    A structured conversation between clean tailored contours and absolute ease. Broad shoulders, heavy-weight cotton blends, and drop silhouettes defined for comfort.
                                </p>
                                <div className="pt-2">
                                    <button 
                                        onClick={scrollToCatalog}
                                        className="group flex items-center gap-1.5 bg-white text-black px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-md"
                                    >
                                        View Drop
                                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Assurances Bar */}
            <section className="bg-white border-b border-neutral-100 py-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100/70 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 py-2 sm:py-0">
                            <div className="p-3 bg-neutral-50 rounded-full text-black mb-1.5">
                                <Truck className="w-4.5 h-4.5 stroke-[1.5]" />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900">Complimentary Shipping</span>
                            <span className="text-[9px] text-neutral-400 font-semibold uppercase mt-0.5 tracking-wider">Free delivery above ₹1,999</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 py-2 sm:py-0">
                            <div className="p-3 bg-neutral-50 rounded-full text-black mb-1.5">
                                <RotateCcw className="w-4.5 h-4.5 stroke-[1.5]" />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900">Exchange Guarantee</span>
                            <span className="text-[9px] text-neutral-400 font-semibold uppercase mt-0.5 tracking-wider">Hassle-free 7-day swap policy</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 py-2 sm:py-0">
                            <div className="p-3 bg-neutral-50 rounded-full text-black mb-1.5">
                                <ShieldCheck className="w-4.5 h-4.5 stroke-[1.5]" />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900">Secured Payments</span>
                            <span className="text-[9px] text-neutral-400 font-semibold uppercase mt-0.5 tracking-wider">Fully encrypted SSL transactions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Brand Footer */}
            <footer className="bg-neutral-950 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
                    <h3 className="text-xl font-extrabold tracking-[0.3em] text-white uppercase">FLEXDRIP</h3>
                    <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest max-w-xs mx-auto">
                        Elevated essentials and oversized drops engineered for the modern wardrobe.
                    </p>
                    <div className="w-8 h-[1px] bg-neutral-800 mx-auto" />
                    <p className="text-[9px] text-neutral-500 font-semibold tracking-wider">© 2026 FLEXDRIP CLOTHING CO. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
