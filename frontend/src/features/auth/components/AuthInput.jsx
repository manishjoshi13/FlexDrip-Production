import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({
    label,
    labelRight,
    Icon,
    type = 'text',
    placeholder,
    required = false,
    value,
    onChange,
    pattern,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                {label && <label className="text-sm font-medium text-gray-700 block">{label}</label>}
                {labelRight && labelRight}
            </div>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full pl-11 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all placeholder:text-gray-400 ${
                        isPassword ? 'pr-11' : 'pr-4'
                    }`}
                    required={required}
                    value={value}
                    onChange={onChange}
                    pattern={pattern}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthInput;
