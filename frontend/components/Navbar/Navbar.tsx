'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore as useAuth } from '@/store/useAuthStore';

import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
          {user && user.role === 'user' ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-100 p-1.5 pr-4 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="size-8 rounded-full bg-primary-blue text-white flex items-center justify-center overflow-hidden font-bold text-sm">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 hidden md:block">{user.name.split(' ')[0]}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                       <div className="p-2">
                        <Link 
                          href="/user/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-blue/5 hover:text-primary-blue rounded-xl transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                          User Dashboard
                        </Link>
                        
                        <Link 
                          href="/user/my-hostel"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-blue/5 hover:text-primary-blue rounded-xl transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                          My Hostel
                        </Link>
                        
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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
