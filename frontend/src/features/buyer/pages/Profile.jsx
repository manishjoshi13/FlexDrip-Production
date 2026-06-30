import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import Navbar from '../components/Navbar';
import { User, Phone, Mail, Award, CheckCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const { user, isLoading, error, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('buyer');
    const [localError, setLocalError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setPhone(user.phone || '');
            setRole(user.role || 'buyer');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMsg('');

        if (!fullName.trim()) {
            setLocalError('Full name is required');
            return;
        }

        const phoneStr = phone.toString().trim();
        if (!phoneStr || phoneStr.length !== 10 || isNaN(phoneStr)) {
            setLocalError('Phone number must be a valid 10-digit number');
            return;
        }

        const result = await updateProfile({
            fullName: fullName.trim(),
            phone: Number(phoneStr),
            role: user?.profileCompleted ? user.role : role // Lock role if profileCompleted is true
        });

        if (result?.success) {
            setSuccessMsg('Profile updated successfully.');
            setTimeout(() => {
                if (user?.role === 'seller') {
                    navigate('/seller');
                } else {
                    navigate('/');
                }
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
            <Navbar />

            <main className="max-w-xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
                    <div className="border-b border-neutral-100 pb-4 text-center sm:text-left">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-950">My Profile</h2>
                        <p className="text-xs text-neutral-400 font-medium mt-1">View or edit your account information.</p>
                    </div>

                    {/* Alert banners */}
                    {localError && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            {localError}
                        </div>
                    )}
                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-xs text-green-700 font-semibold">
                            <CheckCircle className="w-4 h-4 shrink-0 text-green-500" />
                            {successMsg}
                        </div>
                    )}

                    {user?.profileCompleted === false && (
                        <div className="p-4 bg-amber-50 border border-amber-100/70 rounded-2xl text-xs text-amber-800 font-medium leading-relaxed">
                            ⚠️ **Profile Incomplete:** Please set your phone number and confirm your account role. Once your profile is complete, your role cannot be changed.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-200 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Email (Readonly) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address (Locked)</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    readOnly
                                    value={user?.email || ''}
                                    className="w-full bg-neutral-100/70 border border-neutral-100 text-neutral-400 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    className="w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-200 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Account Role */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Account Type</label>
                            <div className="relative">
                                <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                {user?.profileCompleted ? (
                                    <input
                                        type="text"
                                        readOnly
                                        value={user.role === 'seller' ? 'Seller (Merchant)' : 'Buyer (Customer)'}
                                        className="w-full bg-neutral-100/70 border border-neutral-100 text-neutral-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold capitalize outline-none cursor-not-allowed"
                                    />
                                ) : (
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-200 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none cursor-pointer"
                                    >
                                        <option value="buyer">Buyer (Shop items)</option>
                                        <option value="seller">Seller (Manage products)</option>
                                    </select>
                                )}
                            </div>
                            {user?.profileCompleted && (
                                <span className="text-[9px] text-gray-400 font-medium block mt-1">
                                    * Your account type cannot be modified once profile setup is completed.
                                </span>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-md mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Profile Changes'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;
