import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError } from '../auth.slice';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import RoleSelector from '../components/RoleSelector';

const Login = () => {
    const [role, setRole] = useState('buyer');
    const { user, login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlError = params.get('error');
        if (urlError) {
            dispatch(setError(urlError));
            navigate('/login', { replace: true });
        }
    }, [navigate, dispatch]);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const loginHandle = async (e) => {
        e.preventDefault();
        await login({ ...formData, role });
    };

    const forgotPasswordLink = (
        <NavLink to="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Forgot password?
        </NavLink>
    );

    const footerElement = (
        <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-semibold text-gray-900 hover:underline underline-offset-4">
                Sign up
            </NavLink>
        </p>
    );

    return (
        <AuthLayout
            subtitle="Welcome back, please enter your details."
            error={error}
            footer={footerElement}
            headerMarginClass="mb-10"
        >
            {/* Role Selector */}
            <RoleSelector
                role={role}
                onChange={setRole}
                className="mb-8"
            />

            {/* Form */}
            <form className="space-y-5" onSubmit={loginHandle}>
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

                {/* Password */}
                <AuthInput
                    label="Password"
                    labelRight={forgotPasswordLink}
                    Icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
