'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="container mx-auto px-6">
      <div className="flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-blue">
          <div className="w-8 h-8 bg-primary-blue text-white rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-black">StaySync</span>
        </Link>

        <div className="hidden md:flex gap-8 text-[0.95rem] font-medium text-foreground">
          <Link href="/" className="text-black hover:text-primary-blue transition-colors cursor-pointer">Home</Link>
          <Link href="/explore-hostels" className="text-black hover:text-primary-blue transition-colors cursor-pointer">Find Hostels</Link>
          <Link href="#how-it-works" className="text-black hover:text-primary-blue transition-colors cursor-pointer">How It Works</Link>
          <Link href="#contact" className="text-black hover:text-primary-blue transition-colors cursor-pointer">Contact</Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-5 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="border border-primary-blue text-primary-blue bg-transparent hover:bg-primary-blue/5 px-5 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer inline-block text-center flex items-center justify-center">
                Login
              </Link>
              <Link href="/register" className="bg-primary-blue hover:bg-primary-blue-light border border-primary-blue hover:border-primary-blue-light text-white px-5 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer inline-block text-center flex items-center justify-center">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
