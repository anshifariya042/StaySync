'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore as useAuth } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
    const [forgotStep, setForgotStep] = useState<'email' | 'otp-reset'>('email');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, googleLogin, requestOTP, verifyOTP, resetPassword } = useAuth();
    const { fetchProfile } = useUserStore();
    const router = useRouter();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError('');
        try {
            if (credentialResponse.credential) {
                const loggedInUser = await googleLogin(credentialResponse.credential);
                await fetchProfile(); // Sync profile store
                if (loggedInUser.role === 'superadmin') {
                    router.push('/superadmin');
                } else if (loggedInUser.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (loggedInUser.role === 'staff') {
                    router.push('/staff/dashboard');
                } else {
                    router.push('/');
                }
            } else {
                setError('Google authentication failed. No credential received.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google Sign-In failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign-In failed. Please check your credentials or try again later.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const loggedInUser = await login({ email, password });
            await fetchProfile(); // Sync profile store
            if (loggedInUser.role === 'superadmin') {
                router.push('/superadmin');
            } else if (loggedInUser.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (loggedInUser.role === 'staff') {
                router.push('/staff/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid login credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await requestOTP(email);
            setForgotStep('otp-reset');
            setSuccess('OTP has been sent to your email.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await resetPassword({ email, otp, newPassword });
            setSuccess('Password reset successful! You can now log in.');
            setAuthMode('login');
            setForgotStep('email');
            setPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 text-black">
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative">
                    <button 
                        onClick={() => {
                            if (authMode === 'forgot' && forgotStep === 'otp-reset') {
                                setForgotStep('email');
                                setSuccess('');
                            } else if (authMode === 'forgot') {
                                setAuthMode('login');
                                setError('');
                                setSuccess('');
                            } else {
                                router.push('/');
                            }
                        }}
                        className="text-gray-800 hover:bg-gray-100 p-2 rounded-full absolute left-0 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#111827] w-full text-center tracking-tight">StaySync</h1>
                </div>

                {/* Image Area */}
                <div className="w-full h-[120px] rounded-xl overflow-hidden mb-8">
                    <img src="/hero_room.png" alt="Workspace" className="w-full h-full object-cover" />
                </div>

                <h2 className="text-[28px] font-extrabold text-center text-[#111827] mb-2 tracking-tight">
                    {authMode === 'login' ? 'Welcome back' : 'Reset Password'}
                </h2>
                <p className="text-[#6b7280] text-center text-[15px] mb-6">
                    {authMode === 'login' 
                        ? 'Login to manage your workspace' 
                        : forgotStep === 'email' 
                            ? 'Enter your email to receive an OTP' 
                            : 'Enter the OTP and your new password'}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center mb-6">
                        {success}
                    </div>
                )}

                {authMode === 'login' ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8 mt-5">
                            <label className="flex items-center cursor-pointer group">
                                <input type="checkbox" className="w-[18px] h-[18px] rounded border-gray-300 text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" />
                                <span className="ml-2 text-[14px] font-medium text-[#4b5563] group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <button 
                                type="button" 
                                onClick={() => { setAuthMode('forgot'); setError(''); setSuccess(''); }}
                                className="text-[14px] font-bold text-[#4f46e5] hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white py-[14px] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Singing in...' : 'Sign in'}
                            {!isLoading && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                            )}
                        </button>
                    </form>
                ) : forgotStep === 'email' ? (
                    <form onSubmit={handleForgotPasswordRequest}>
                        <div className="mb-8">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white py-[14px] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPasswordSubmit}>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">OTP Code</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af] text-center tracking-[1em] font-bold"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-[14px] font-bold text-[#374151] mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white py-[14px] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {authMode === 'login' && (
                    <>
                        <div className="flex items-center my-8">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="px-4 text-[12px] font-bold text-[#9ca3af] uppercase tracking-[0.08em]">Or continue with</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="w-full flex flex-col items-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                shape="pill"
                                size="large"
                                width="100%"
                                text="continue_with"
                            />
                        </div>
                    </>
                )}

                <p className="text-center text-[15px] text-[#6b7280] mt-8">
                    {authMode === 'login' 
                        ? (
                            <>
                                Don't have an account? <Link href="/register" className="text-[#4f46e5] font-bold hover:underline">Sign up for free</Link>
                            </>
                        ) : (
                            <button 
                                onClick={() => { setAuthMode('login'); setForgotStep('email'); setError(''); setSuccess(''); }}
                                className="text-[#4f46e5] font-bold hover:underline"
                            >
                                Back to login
                            </button>
                        )
                    }
                </p>

            </div>
        </div>
    );
}
