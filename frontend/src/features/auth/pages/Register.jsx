import React, { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import RoleSelector from '../components/RoleSelector';

const Register = () => {
    const [role, setRole] = useState('buyer');
    const { user, register, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const registerHandle = async (e) => {
        e.preventDefault();
        const result = await register({ ...formData, role });
        if (result?.success) {
            setRegisteredEmail(formData.email);
            setIsEmailSent(true);
        }
    };

    const footerElement = !isEmailSent ? (
        <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <NavLink to="/login" className="font-semibold text-gray-900 hover:underline underline-offset-4">
                Sign in
            </NavLink>
        </p>
    ) : null;

    return (
        <AuthLayout
            subtitle={isEmailSent ? "Verification pending" : "Create your account to get started."}
            error={error}
            footer={footerElement}
            cardClassName="my-8"
            headerMarginClass="mb-8"
        >
            {isEmailSent ? (
                <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-stone-800 animate-pulse" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 uppercase tracking-wider mb-2">Check Your Inbox</h2>
                    <p className="text-sm text-stone-600 leading-relaxed mb-8">
                        We have sent a verification link to <strong className="text-stone-900">{registeredEmail}</strong>.<br />
                        Please click the link in your email to complete registration. The link will be active for 15 minutes.
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
                <>
                    {/* Role Selector */}
                    <RoleSelector
                        role={role}
                        onChange={setRole}
                        className="mb-6"
                    />

                    {/* Form */}
                    <form className="space-y-4" onSubmit={registerHandle}>
                        {/* Full Name */}
                        <AuthInput
                            label="Full Name"
                            Icon={User}
                            type="text"
                            placeholder="John Doe"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />

                        {/* Email */}
                        <AuthInput
                            label="Email"
                            Icon={Mail}
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        {/* Phone */}
                        <AuthInput
                            label="Phone Number"
                            Icon={Phone}
                            type="tel"
                            pattern="[0-9]{10}"
                            placeholder="10-digit mobile number"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        {/* Password */}
                        <AuthInput
                            label="Password"
                            Icon={Lock}
                            type="password"
                            placeholder="Create a strong password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </AuthLayout>
    );
};

export default Register;
