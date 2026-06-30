import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';

const ForgotPassword = () => {
    const { forgotPassword, isLoading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await forgotPassword(email);
        if (result?.success) {
            setIsEmailSent(true);
        }
    };

    const footerElement = (
        <p className="mt-8 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <NavLink to="/login" className="font-semibold text-gray-900 hover:underline underline-offset-4">
                Sign in
            </NavLink>
        </p>
    );

    return (
        <AuthLayout
            subtitle={isEmailSent ? "Recovery link sent" : "Enter your email to reset your password."}
            error={error}
            footer={footerElement}
            cardClassName="my-8"
            headerMarginClass="mb-8"
        >
            {isEmailSent ? (
                <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                        <KeyRound className="w-8 h-8 text-stone-800 animate-pulse" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 uppercase tracking-wider mb-2">Check Your Email</h2>
                    <p className="text-sm text-stone-600 leading-relaxed mb-8">
                        We have sent a secure password reset link to <strong className="text-stone-900">{email}</strong>.<br />
                        Please follow the instructions in the email to set your new password. The link will remain active for 15 minutes.
                    </p>
                    <NavLink
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-stone-900 transition-colors"
                    >
                        Return to Sign In
                        <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <AuthInput
                        label="Email Address"
                        Icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending Link...
                            </>
                        ) : (
                            <>
                                Send Reset Link
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
