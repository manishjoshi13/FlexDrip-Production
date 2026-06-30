import React from 'react';
import { Plus, PackageOpen } from 'lucide-react';

const EmptyState = ({ onAddClick }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
            {/* Icon Circle */}
            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 mb-6 relative">
                <PackageOpen className="w-10 h-10 stroke-[1.25] text-gray-900" />
                <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-black rounded-full flex items-center justify-center text-white border-2 border-white">
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </div>
            </div>

            {/* Title & Desc */}
            <h3 className="text-lg font-bold text-gray-950 mb-2">No products found</h3>
            <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed mb-8">
                It looks like you haven't uploaded any products yet. Get started by adding your first product to the catalog.
            </p>

            {/* CTA Button */}
            <button
                type="button"
                onClick={onAddClick}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Your First Product
            </button>
        </div>
    );
};

export default EmptyState;
