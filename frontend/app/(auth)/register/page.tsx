'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore as useAuth } from '@/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, googleLogin } = useAuth();
    const router = useRouter();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError('');
        try {
            if (credentialResponse.credential) {
                const loggedInUser = await googleLogin(credentialResponse.credential);
                if (loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin') {
                    router.push('/admin/dashboard');
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

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const loggedInUser = await register({ name, email, password, confirmPassword });
            if (loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 text-black">
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative">
                    <Link href="/" className="text-gray-800 hover:bg-gray-100 p-2 rounded-full absolute left-0 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </Link>
                    <h1 className="text-xl font-extrabold text-[#111827] w-full text-center tracking-tight">StaySync</h1>
                </div>

                {/* Hero Image */}
                <div className="w-full h-[160px] rounded-xl overflow-hidden mb-8">
                    <img src="/hero_room.png" alt="Workspace" className="w-full h-full object-cover" />
                </div>

                <h2 className="text-[32px] font-extrabold text-center text-[#111827] mb-2 tracking-tight">Create an account</h2>
                <p className="text-[#6b7280] text-center text-[15px] mb-6">Sign up to get started with StaySync</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[14px] font-bold text-[#374151] mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                            />
                        </div>
                    </div>

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

                    <div className="mb-8">
                        <label className="block text-[14px] font-bold text-[#374151] mb-2">Secure Password</label>
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

                    <div className="mb-4">
                        <label className="block text-[14px] font-bold text-[#374151] mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white py-[14px] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                        {!isLoading && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        )}
                    </button>
                </form>

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
                        text="signup_with"
                    />
                </div>

                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="px-4 text-[12px] font-bold text-[#9ca3af] uppercase tracking-[0.08em]">Are you a hostel owner?</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Link
                    href="/register-hostel"
                    className="w-full bg-white border-2 border-[#4f46e5] text-[#4f46e5] py-3 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all hover:bg-indigo-50"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Create a Hostel
                </Link>

                <p className="text-center text-[15px] text-[#6b7280] mt-8">
                    Already have an account? <Link href="/login" className="text-[#4f46e5] font-bold hover:underline">Log in here</Link>
                </p>
            </div>
        </div>
    );
}
