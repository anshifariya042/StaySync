"use client";

import React, { useEffect, useState, Suspense } from "react";
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
    roomTypes: string[];
}

import { useSearchParams } from "next/navigation";

function ExploreHostelsContent() {
    const searchParams = useSearchParams();
    
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);

    // Search and Filters
    const [search, setSearch] = useState(searchParams.get('search') || "");
    const [location, setLocation] = useState(searchParams.get('location') || "All Locations");
    const [filterFacilities, setFilterFacilities] = useState<string[]>(
        searchParams.get('facilities') ? searchParams.get('facilities')!.split(',') : []
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
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
            params.append('page', currentPage.toString());

            const res = await api.get(`/hostels?${params.toString()}`);
            const rawHostels = res.data.hostels || [];
            // Defensively filter out broken db records
            const validHostels = rawHostels.filter((h: any) => h && typeof h.name === 'string');
            setHostels(validHostels);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to load hostels', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, [currentPage]);

    // Fetch on initial load if there are filters in URL
    useEffect(() => {
        if (search || location !== "All Locations" || filterFacilities.length > 0) {
            fetchHostels();
        }
    }, []);

    const handleSearch = () => {
        if (currentPage === 1) {
            fetchHostels();
        } else {
            setCurrentPage(1); // changing page will automatically trigger fetch in useEffect
        }
    };

    const toggleFacility = (fac: string) => {
        setFilterFacilities(prev =>
            prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
        );
    };

    return (
        <div className="flex max-w-[1600px] mx-auto min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 w-full">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-[#111827] mb-2">Explore Hostels</h2>
                    <p className="text-[#374151]">Find your perfect stay from verified hostels</p>
                </header>

                {/* Search and Filter Bar */}
                <section className="bg-white rounded-[16px] shadow-lg shadow-gray-200/60 p-3 md:p-4 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            {/* <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">search</span> */}
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] transition-all text-sm md:text-base outline-none"
                                placeholder="Search by name or location..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex items-center justify-between w-full md:w-48 px-4 py-3 pl-10 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border-none text-sm md:text-base appearance-none focus:ring-2 focus:ring-[#2563EB] outline-none cursor-pointer"
                                >
                                    <option value="All Locations">Select Location</option>
                                    <option>New York</option>
                                    <option>London</option>
                                    <option>Berlin</option>
                                    <option>Bangalore</option>
                                    <option>Kochi</option>
                                    <option>Kasargod</option>
                                </select>
                                {/* <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">location_on</span>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span> */}
                            </div>

                            <button
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border-none text-sm md:text-base cursor-pointer"
                            >
                                {/* <span className="material-symbols-outlined text-[20px] text-gray-500">tune</span> */}
                                {/* <span>Filters</span> */}
                            </button>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full md:w-32 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-sm md:text-base"
                        >
                            Search
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-8">
                        <div className="flex-[2] min-w-[300px]">
                            <p className="text-sm font-bold text-slate-700 mb-3">Facilities</p>
                            <div className="flex flex-wrap gap-4">
                                {['WiFi', 'Mess', 'Security', 'Laundry', 'CCTV', 'AC'].map(fac => (
                                    <label key={fac} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            checked={filterFacilities.includes(fac)}
                                            onChange={() => toggleFacility(fac)}
                                            className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] size-4 cursor-pointer"
                                            type="checkbox"
                                        />
                                        <span className="text-sm group-hover:text-[#2563EB] transition-colors">{fac}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hostels.map((hostel) => (
                                <div key={hostel._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D1D5DB] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="h-52 overflow-hidden relative shrink-0">
                                        <img alt={hostel.name} src={hostel.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#111827] leading-tight">{hostel.name}</h3>
                                                <div className="flex items-center gap-1 text-[#374151] mt-1">
                                                    {/* <span className="material-symbols-outlined text-sm">location_on</span> */}
                                                    <span className="text-sm">{hostel.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg shrink-0">
                                                <span className="material-symbols-outlined text-yellow-500 text-sm fill-1">star</span>
                                                <span className="text-xs font-bold text-green-700">{hostel.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 my-4 mt-auto">
                                            {hostel.facilities.map((fac, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-50 rounded-lg text-[10px] font-semibold text-[#2563EB] flex items-center gap-1">
                                                    {fac}
                                                </span>
                                            ))}
                                            {hostel.roomTypes && hostel.roomTypes.map((type, idx) => (
                                                <span key={`type-${idx}`} className="px-2 py-1 bg-amber-50 rounded-lg text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs"></span> {type}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-[#D1D5DB] mt-2 border-dashed">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-[#374151] tracking-wider">Starting from</p>
                                                <p className="text-xl font-black text-[#2563EB]">{hostel.price || 0}<span className="text-xs text-[#374151] font-normal">/mo</span></p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8] transition-all flex items-center justify-center">
                                                    Book now
                                                </button>
                                                <Link
                                                    href={`/hostel/${hostel._id}`}
                                                    className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#1d4ed8] transition-all flex items-center justify-center"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hostels.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500">
                                    No hostels found matching your criteria.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center pb-8">
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    // className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        {/* <span className="material-symbols-outlined">chevron_left</span> */}
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${currentPage === i + 1
                                                ? 'bg-[#2563EB] text-white font-bold'
                                                : 'border border-[#D1D5DB] hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    // className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        {/* <span className="material-symbols-outlined">chevron_right</span> */}
                                    </button>
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
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div></div>}>
            <ExploreHostelsContent />
        </Suspense>
    );
}
