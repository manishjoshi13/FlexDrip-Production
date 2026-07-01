import React from 'react';
import { Tag, ArrowUpRight } from 'lucide-react';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const BuyerProductCard = ({ product }) => {
    const { _id, id, title, price, images, category } = product;
    const productId = _id || id;
    
    const currencySymbol = currencySymbols[price?.currency] || '₹';
    const priceAmount = price?.amount !== undefined ? price.amount : 0;
    
    const firstImageUrl = images && images.length > 0 ? images[0].url : null;

    return (
        <a 
            href={`/product/${productId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col h-full bg-transparent border-none p-0 transition-all duration-300 text-inherit no-underline cursor-pointer"
        >
            {/* Image Container (3:4 Aspect Ratio) */}
            <div className="relative aspect-[3/4] w-full bg-[#f3f3f2] overflow-hidden shrink-0 rounded-2xl transition-all duration-500 border border-neutral-100/30">
                {firstImageUrl ? (
                    <img 
                        src={firstImageUrl} 
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-400 p-6">
                        <Tag className="w-6 h-6 stroke-[1.25] mb-1.5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">No Image</span>
                    </div>
                )}

                {/* Quick View Button (Top-Right Floating) */}
                <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-100 flex items-center justify-center shadow-md text-black hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all duration-200">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="pt-3 pb-1 px-0.5 flex flex-col flex-grow justify-between">
                <div className="space-y-1">
                    {category && (
                        <span className="text-[8.5px] font-bold text-neutral-400 uppercase tracking-[0.2em] block">
                            {category}
                        </span>
                    )}
                    <h3 className="text-xs sm:text-[13px] font-bold text-neutral-850 line-clamp-1 group-hover:text-black transition-colors tracking-wide leading-tight">
                        {title}
                    </h3>
                </div>
                <span className="text-xs font-semibold text-neutral-550 mt-2.5 tracking-wider block">
                    {currencySymbol}{Number(priceAmount).toLocaleString()}
                </span>
            </div>
        </a>
    );
};

export default BuyerProductCard;
