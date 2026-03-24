import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border-color pt-16 mt-16 pb-12" id="contact">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">

                    <div>
                        <div className="flex items-center gap-2 font-bold text-xl text-primary-blue mb-4">
                            <div className="size-8 bg-primary-blue text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary-blue/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <span>StaySync</span>
                        </div>
                        <p className="text-text-gray leading-[1.7] text-[0.95rem] mb-8 max-w-[85%] font-medium">
                            The leading digital solution for modern student and professional hostel living management worldwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-9 h-9 border border-border-color rounded-full flex items-center justify-center text-text-gray hover:text-primary-blue hover:border-primary-blue transition-all">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"></path></svg>
                            </a>
                            <a href="#" className="w-9 h-9 border border-border-color rounded-full flex items-center justify-center text-text-gray hover:text-primary-blue hover:border-primary-blue transition-all">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Platform</h4>
                        <div className="flex flex-col gap-4">
                            <Link href="/explore-hostels" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Find Hostels</Link>
                            <Link href="#how-it-works" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">How it Works</Link>
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Pricing</Link>
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Mobile App</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Support</h4>
                        <div className="flex flex-col gap-4">
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Help Center</Link>
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Report Issue</Link>
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Terms of Service</Link>
                            <Link href="#" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors font-medium">Privacy Policy</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Contact</h4>
                        <div className="flex flex-col gap-5">
                            <a href="mailto:hello@staysync.com" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors flex items-center gap-3 font-medium">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                hello@staysync.com
                            </a>
                            <a href="tel:+15550000000" className="text-text-gray text-[0.95rem] hover:text-primary-blue transition-colors flex items-center gap-3 font-medium">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                +1 (555) 000-0000
                            </a>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-color text-text-gray opacity-50 text-[10px] font-black uppercase tracking-[0.2em] gap-4">
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
