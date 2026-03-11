"use client";

import React, { useEffect, useState } from "react";
import api from '@/lib/api';
import Link from 'next/link';

interface Hostel {
    _id: string;
    name: string;
    location: string;
    price: number;
    images: string[]
    rating: number;
    facilities: string[];
}

export default function ExploreHostels() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await api.get('/hostels');
                setHostels(res.data.hostels);
            } catch (err) {
                console.error('Failed to load hostels', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHostels();
    }, []);

    return (
        <div className="flex max-w-[1600px] mx-auto min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
            {/* Sidebar */}
            <aside className="w-64 hidden lg:flex flex-col border-r border-[#D1D5DB] h-[calc(100vh-64px)] sticky top-16 p-6 gap-2">
                <Link href="/explore-hostels" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4F46E5]/10 font-semibold transition-all">
                    <span className="material-symbols-outlined">explore</span>
                    <span>Explore Hostels</span>
                </Link>
                <Link href="/my-hostel" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#374151] hover:bg-[#4F46E5]/5 transition-all">
                    <span className="material-symbols-outlined">hotel</span>
                    <span>My Hostel</span>
                </Link>
                <Link href="/my-bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#374151] hover:bg-[#4F46E5]/5 transition-all">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span>My Bookings</span>
                </Link>
                <Link href="/raise-complaint" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#374151] hover:bg-[#4F46E5]/5 transition-all">
                    <span className="material-symbols-outlined">report_problem</span>
                    <span>Raise Complaint</span>
                </Link>
                <div className="mt-auto">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#374151] hover:bg-[#4F46E5]/5 transition-all">
                        <span className="material-symbols-outlined">person</span>
                        <span>Profile Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-[#111827] mb-2">Explore Hostels</h2>
                    <p className="text-[#374151]">Find your perfect stay from 150+ verified hostels</p>
                </header>

                {loading ? (
                    <p>Loading hostels...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {hostels.map((hostel) => (
                            <div key={hostel._id} className="group bg-white rounded-2xl overflow-hidden border border-[#D1D5DB] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-52 overflow-hidden relative">
                                    <img alt={hostel.name} src={hostel.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-[#374151] hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-xl">favorite</span>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111827] leading-tight">{hostel.name}</h3>
                                            <div className="flex items-center gap-1 text-[#374151] mt-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                <span className="text-sm">{hostel.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm fill-1">star</span>
                                            <span className="text-xs font-bold text-green-700">{hostel.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 my-4">
                                        {hostel.facilities.map((fac, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-[#F9FAFB] rounded-lg text-[10px] font-semibold text-[#374151] flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">{fac.toLowerCase().includes('wifi') ? 'wifi' : fac.toLowerCase().includes('mess') ? 'restaurant' : fac.toLowerCase().includes('security') ? 'shield' : fac.toLowerCase().includes('laundry') ? 'local_laundry_service' : fac.toLowerCase().includes('gym') ? 'fitness_center' : ''}</span> {fac}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-[#D1D5DB]">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#374151] tracking-wider">Starting from</p>
                                            <p className="text-xl font-black text-[#4F46E5]">${hostel.price}<span className="text-xs text-[#374151] font-normal">/mo</span></p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-3 border border-[#D1D5DB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button className="bg-[#4F46E5] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#4338CA] transition-all">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
