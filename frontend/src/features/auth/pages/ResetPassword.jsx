import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';

const ResetPassword = () => {
    const { resetPassword, isLoading, error } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!token) {
            setLocalError('Reset token is missing from the URL.');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (password.length < 8 || !passwordRegex.test(password)) {
            setLocalError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }

        const result = await resetPassword(token, password);
        if (result?.success) {
            setIsSuccess(true);
        }
    };

    const footerElement = (
        <p className="mt-8 text-center text-sm text-gray-500">
            Back to{' '}
            <NavLink to="/login" className="font-semibold text-gray-900 hover:underline underline-offset-4">
                Sign in
            </NavLink>
        </p>
    );

    return (
        <AuthLayout
            subtitle={isSuccess ? "Password updated" : "Set your new password below."}
            error={localError || error}
            footer={footerElement}
            cardClassName="my-8"
            headerMarginClass="mb-8"
        >
            {!token ? (
                <div className="text-center py-4">
                    <p className="text-sm text-red-600 mb-6">
                        Invalid password reset link. The link is missing its secure authentication token.
                    </p>
                    <NavLink
                        to="/forgot-password"
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-stone-900 transition-colors"
                    >
                        Request New Link
                        <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>
            ) : isSuccess ? (
                <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-stone-800" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 uppercase tracking-wider mb-2">Reset Complete</h2>
                    <p className="text-sm text-stone-600 leading-relaxed mb-8">
                        Your password has been successfully updated. You can now log in using your new credentials.
                    </p>
                    <NavLink
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-stone-900 transition-colors"
                    >
                        Proceed to Sign In
                        <ArrowRight className="w-4 h-4" />
                    </NavLink>
                </div>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Password */}
                    <AuthInput
                        label="New Password"
                        Icon={Lock}
                        type="password"
                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Confirm Password */}
                    <AuthInput
                        label="Confirm New Password"
                        Icon={Lock}
                        type="password"
                        placeholder="Confirm password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Resetting Password...
                            </>
                        ) : (
                            <>
                                Reset Password
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
