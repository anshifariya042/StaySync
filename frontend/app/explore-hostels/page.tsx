"use client";

import React, { useEffect, useState, Suspense } from "react";
import api from '@/lib/api';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Hostel {
    _id: string;
    name: string;
    location: string;
    price: number;
    images: string[]
    rating: number;
    facilities: string[];
    roomTypes: string[];
}

function ExploreHostelsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState(searchParams.get('search') || "");
    const [location, setLocation] = useState(searchParams.get('location') || "All Locations");
    const [filterFacilities, setFilterFacilities] = useState<string[]>(
        searchParams.get('facilities') ? searchParams.get('facilities')!.split(',') : []
    );

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || "");

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHostels = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (location && location !== "All Locations") params.append('location', location);
            if (filterFacilities.length > 0) {
                params.append('facilities', filterFacilities.join(','));
            }
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            params.append('page', currentPage.toString());

            const res = await api.get(`/hostels?${params.toString()}`);
            const rawHostels = res.data.hostels || [];
            const validHostels = rawHostels.filter((h: any) => h && typeof h.name === 'string');
            setHostels(validHostels);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to load hostels', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoomTypeLabel = (type: string) => {
        const mapping: { [key: string]: string } = {
            'Standard': 'single',
            'AC': 'Two sharing',
            'Deluxe': 'Four sharing'
        };
        return mapping[type] || type;
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchHostels();
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (location && location !== "All Locations") params.set('location', location);
            if (filterFacilities.length > 0) params.set('facilities', filterFacilities.join(','));
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            if (currentPage > 1) params.set('page', currentPage.toString());

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, location, filterFacilities, minPrice, maxPrice, currentPage, pathname, router]);

    const handleSearch = () => {
        fetchHostels();
    };

    const toggleFacility = (fac: string) => {
        setFilterFacilities(prev =>
            prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
        );
        setCurrentPage(1);
    };

    return (
        <div className="flex max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC] text-[#1e293b] font-sans">
            <main className="flex-1 p-6 md:p-10 w-full">
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-2">Explore Hostels</h2>
                    <p className="text-slate-500 text-lg">Premium verified stays for your next journey.</p>
                </header>

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-10">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="Where would you like to stay?"
                                type="text"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full md:w-40 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                        >
                            Search Now
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Filter by Facilities</p>
                        <div className="flex flex-wrap gap-3">
                            {['WiFi', 'Mess', 'Security', 'Laundry', 'CCTV', 'AC'].map(fac => (
                                <label key={fac} className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${filterFacilities.includes(fac) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                    <input
                                        checked={filterFacilities.includes(fac)}
                                        onChange={() => toggleFacility(fac)}
                                        className="hidden"
                                        type="checkbox"
                                    />
                                    <span className="text-sm font-medium">{fac}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hostels.map((hostel) => (
                                <div key={hostel._id} className="group bg-white rounded-[24px] overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
                                    {/* Image Section */}
                                    <div className="h-64 overflow-hidden relative">
                                        <img 
                                            alt={hostel.name} 
                                            src={hostel.images?.[0] || 'https://via.placeholder.com/400x300'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 left-4">
                                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                                <span className="text-yellow-500 text-sm">★</span>
                                                <span className="text-xs font-bold text-slate-800">{hostel.rating || ''}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{hostel.name}</h3>
                                            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                <span className="text-sm font-medium uppercase tracking-wide">{hostel.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {hostel.facilities.slice(0, 3).map((fac, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold uppercase tracking-tighter">
                                                    {fac}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                            <div>
                                                {/* <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Monthly Rent</p> */}
                                                <p className="text-2xl font-bold text-slate-900">
                                                    ₹{hostel.price.toLocaleString()}<span className="text-sm text-slate-400 font-normal">/mo</span>
                                                </p>
                                            </div>
                                            <Link
                                                href={`/hostel/${hostel._id}`}
                                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all duration-300"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {hostels.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium">No stays match your current search criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center pb-12">
                                <nav className="flex items-center gap-3">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 font-bold ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default function ExploreHostels() {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <ExploreHostelsContent />
        </Suspense>
    );
}