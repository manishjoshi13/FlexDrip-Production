import React from 'react';
import { UserRound, Store } from 'lucide-react';

const RoleSelector = ({ role, onChange, className = 'mb-6' }) => {
    return (
        <div className={`relative flex p-1 bg-gray-100 rounded-xl ${className}`}>
            {/* Sliding Black Background */}
            <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-lg transition-transform duration-300 ease-out ${
                    role === 'seller' ? 'translate-x-full' : 'translate-x-0'
                }`}
            ></div>

            <button
                type="button"
                onClick={() => onChange('buyer')}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 z-10 ${
                    role === 'buyer' ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
                <UserRound className="w-4 h-4" />
                Buyer
            </button>
            <button
                type="button"
                onClick={() => onChange('seller')}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 z-10 ${
                    role === 'seller' ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
                <Store className="w-4 h-4" />
                Seller
            </button>
        </div>
    );
};

export default RoleSelector;
