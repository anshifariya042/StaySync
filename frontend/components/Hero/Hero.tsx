import React from 'react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between py-16 gap-8">

                <div className="flex-1 w-full max-w-full md:max-w-[50%]">
                    <div className="inline-flex items-center gap-2 bg-[#eff3ff] text-primary-blue-light px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        THE FUTURE OF HOSTEL LIVING
                    </div>

                    <h1 className="text-[3rem] md:text-[4rem] font-extrabold leading-[1.1] mb-6 text-foreground">
                        Find. Stay.<br />
                        <span className="text-primary-blue-light block">Report. Relax.</span>
                    </h1>

                    <p className="text-[1.125rem] text-text-gray leading-[1.6] mb-10 max-w-full md:max-w-[85%]">
                        One smart platform to manage hostel living digitally. Connect with top hostels, manage bookings, and resolve issues in real-time.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/explore-hostels">
                            <button className="bg-primary-blue text-white px-7 py-3 rounded-lg font-semibold text-base border-none cursor-pointer hover:opacity-90 transition-opacity">Explore Hostels</button>
                        </Link>
                        <Link href="/register-hostel">
                            <button className="bg-transparent text-foreground border border-border-color px-7 py-3 rounded-lg font-semibold text-base cursor-pointer hover:bg-gray-50 transition-colors">Register Hostel</button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 relative flex justify-center md:justify-end w-full mt-10 md:mt-0">
                    <div className="relative w-full max-w-[500px] rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                        <img
                            src="/hero_room.png"
                            alt="Bright modern minimal room"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
