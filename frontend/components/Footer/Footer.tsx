import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border-color pt-16 mt-16 pb-8" id="contact">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">

                    <div>
                        <div className="flex items-center gap-2 font-bold text-xl text-primary-blue mb-4">
                            <div className="w-7 h-7 bg-primary-blue text-white rounded-md flex items-center justify-center p-1">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <span>StaySync</span>
                        </div>
                        <p className="text-text-gray leading-[1.6] text-[0.9rem] mb-6 max-w-[80%]">
                            The leading digital solution for modern student and professional hostel living management worldwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-9 h-9 border border-border-color rounded-full flex items-center justify-center text-text-gray hover:border-primary-blue hover:text-primary-blue transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="#" className="w-9 h-9 border border-border-color rounded-full flex items-center justify-center text-text-gray hover:border-primary-blue hover:text-primary-blue transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-bold text-foreground mb-5">Platform</h4>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Find Hostels</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">How it Works</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Pricing</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Mobile App</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-bold text-foreground mb-5">Support</h4>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Help Center</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Report Issue</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Terms of Service</Link>
                            <Link href="#" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">Privacy Policy</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-bold text-foreground mb-5">Contact</h4>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:hello@staysync.com" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                hello@staysync.com
                            </a>
                            <a href="tel:+15550000000" className="text-text-gray text-[0.9rem] hover:text-primary-blue transition-colors flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                +1 (555) 000-0000
                            </a>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-color text-[#9ca3af] text-[0.75rem] font-semibold tracking-[0.05em] gap-4">
                    <span>&copy; 2026 STAYSYNC. ALL RIGHTS RESERVED.</span>
                    <div className="flex gap-8">
                        <span>DESIGNED FOR STUDENTS</span>
                        <span>POWERED BY TECH</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
