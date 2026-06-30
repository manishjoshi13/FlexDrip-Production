import React from 'react';
import { Calendar, Tag, Edit2, Trash2 } from 'lucide-react';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const ProductCard = ({ product, onEdit, onDelete }) => {
    const { title, description, price, images, createdAt } = product;
    
    const currencySymbol = currencySymbols[price?.currency] || '₹';
    const priceAmount = price?.amount !== undefined ? price.amount : 0;
    
    // Format date
    const formattedDate = createdAt 
        ? new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : null;

    const firstImageUrl = images && images.length > 0 ? images[0].url : null;

    return (
        <div className="group bg-white rounded-2xl border border-neutral-200/50 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:border-neutral-400">
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden shrink-0 border-b border-neutral-100/30 p-2">
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-white border border-neutral-100/40">
                    {firstImageUrl ? (
                        <img 
                            src={firstImageUrl} 
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-400 p-6">
                            <Tag className="w-10 h-10 stroke-[1.25] mb-2" />
                            <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                        </div>
                    )}
                </div>
                
                {/* Floating Price Tag */}
                <div className="absolute top-4.5 right-4.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-neutral-150">
                    <span className="text-xs font-bold text-neutral-900">
                        {currencySymbol}{Number(priceAmount).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-black transition-colors mb-1.5">
                    {title}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-neutral-500 font-normal line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {description}
                </p>

                {/* Footer details */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100/50 text-[10px] font-bold text-neutral-400 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="uppercase tracking-wider">{price?.currency || 'INR'}</span>
                    </div>
                    {formattedDate && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{formattedDate}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-neutral-100/50 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(product);
                        }}
                        className="flex-grow flex items-center justify-center gap-1.5 py-2.5 px-3 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 hover:text-black hover:border-neutral-400 transition-all active:scale-95 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(product._id || product.id);
                        }}
                        className="flex-none flex items-center justify-center p-2.5 border border-red-100 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors active:scale-95 cursor-pointer"
                        title="Delete product"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
