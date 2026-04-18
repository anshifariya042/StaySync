'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SearchFilter() {
    const router = useRouter();
    const [location, setLocation] = useState('Select City');
    const [priceRange, setPriceRange] = useState('Any Price');
    const [facilities, setFacilities] = useState('All');
    const [gender, setGender] = useState('Mixed');

    const [availableLocations, setAvailableLocations] = useState<string[]>([]);
    const [availableFacilities, setAvailableFacilities] = useState<string[]>([]);
    const [availablePriceRanges, setAvailablePriceRanges] = useState<{label: string, min?: number, max?: number}[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await api.get('/hostels?limit=1000');
                const hostels = res.data.hostels || [];

                // Extract Locations
                const locations = [...new Set(hostels.map((h: any) => h.location))].filter(Boolean) as string[];
                setAvailableLocations(locations);

                // Extract Facilities
                const facilitiesList: string[] = [];
                hostels.forEach((h: any) => {
                    if (h.facilities && Array.isArray(h.facilities)) {
                        h.facilities.forEach((f: string) => facilitiesList.push(f));
                    }
                });
                setAvailableFacilities([...new Set(facilitiesList)]);

                // Extract Price Ranges logically based on data
                const prices = hostels.map((h: any) => h.price).filter((p: number) => !isNaN(p) && p > 0);
                const standardRanges = [
                    { label: 'Below ₹2000', max: 2000 },
                    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
                    { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
                    { label: 'Above ₹10000', min: 10000 }
                ];
                
                const validRanges = standardRanges.filter(range => {
                    if (range.min && range.max) {
                        return prices.some((p: number) => p >= range.min! && p <= range.max!);
                    } else if (range.min) {
                        return prices.some((p: number) => p >= range.min!);
                    } else if (range.max) {
                        return prices.some((p: number) => p <= range.max!);
                    }
                    return false;
                });
                
                setAvailablePriceRanges(validRanges);

            } catch (err) {
                console.error("Failed to fetch filter options", err);
            }
        };

        fetchFilters();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location !== 'Select City') params.append('location', location);
        
        const selectedRange = availablePriceRanges.find(r => r.label === priceRange);
        if (selectedRange) {
            if (selectedRange.min) params.append('minPrice', selectedRange.min.toString());
            if (selectedRange.max) params.append('maxPrice', selectedRange.max.toString());
        }

        if (facilities !== 'All') params.append('facilities', facilities);
        
        router.push(`/explore-hostels?${params.toString()}`);
    };

//     return (
//         <div className="container mx-auto px-6 relative z-10 -mt-16">
//             <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.05)] gap-4">

//                 <div className="flex-1 flex flex-col gap-2 w-full">
//                     <label className="text-[0.75rem] font-semibold uppercase text-text-gray tracking-[0.05em]">Location</label>
//                     <div className="flex items-center gap-2 bg-gray-50 border border-border-color rounded-lg px-4 py-3">
//                         <svg className="text-text-gray" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
//                         <select 
//                             value={location}
//                             onChange={(e) => setLocation(e.target.value)}
//                             className="border-none bg-transparent w-full text-[0.95rem] font-medium text-foreground outline-none appearance-none cursor-pointer"
//                         >
//                             <option>Select City</option>
//                             {availableLocations.map((loc, i) => (
//                                 <option key={i} value={loc}>{loc}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex-1 flex flex-col gap-2 w-full">
//                     <label className="text-[0.75rem] font-semibold uppercase text-text-gray tracking-[0.05em]">Price Range</label>
//                     <div className="flex items-center gap-2 bg-gray-50 border border-border-color rounded-lg px-4 py-3">
//                         <svg className="text-text-gray" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
//                         <select 
//                             value={priceRange}
//                             onChange={(e) => setPriceRange(e.target.value)}
//                             className="border-none bg-transparent w-full text-[0.95rem] font-medium text-foreground outline-none appearance-none cursor-pointer"
//                         >
//                             <option>Any Price</option>
//                             {availablePriceRanges.map((range, i) => (
//                                 <option key={i} value={range.label}>{range.label}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex-1 flex flex-col gap-2 w-full">
//                     <label className="text-[0.75rem] font-semibold uppercase text-text-gray tracking-[0.05em]">Facilities</label>
//                     <div className="flex items-center gap-2 bg-gray-50 border border-border-color rounded-lg px-4 py-3">
//                         <svg className="text-text-gray" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
//                         <select 
//                             value={facilities}
//                             onChange={(e) => setFacilities(e.target.value)}
//                             className="border-none bg-transparent w-full text-[0.95rem] font-medium text-foreground outline-none appearance-none cursor-pointer"
//                         >
//                             <option>All</option>
//                             {availableFacilities.map((fac, i) => (
//                                 <option key={i} value={fac}>{fac}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex-1 flex flex-col gap-2 w-full">
//                     <label className="text-[0.75rem] font-semibold uppercase text-text-gray tracking-[0.05em]">Gender</label>
//                     <div className="flex items-center gap-2 bg-gray-50 border border-border-color rounded-lg px-4 py-3">
//                         <svg className="text-text-gray" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
//                         <select 
//                             value={gender}
//                             onChange={(e) => setGender(e.target.value)}
//                             className="border-none bg-transparent w-full text-[0.95rem] font-medium text-foreground outline-none appearance-none cursor-pointer"
//                         >
//                             <option>Mixed</option>
//                             <option>Male</option>
//                             <option>Female</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex-1 flex flex-col w-full md:items-end justify-end self-stretch md:pb-[2px] mt-4 md:mt-0">
//                     <button 
//                         onClick={handleSearch}
//                         className="bg-accent-teal hover:bg-[#0ba582] text-white w-full border-none px-8 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-colors h-full md:min-h-[50px]"
//                     >
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                         Search
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );

    return (
        <div className="container mx-auto px-4 relative z-20 -mt-12 md:-mt-16">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-teal-900/10 rounded-[2rem] p-2 flex flex-col md:flex-row items-center gap-2 max-w-6xl mx-auto">

                {/* 1. Location Selection */}
                <div className="flex-1 w-full bg-transparent hover:bg-white rounded-[1.5rem] p-3 transition-all duration-300 group relative border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                    <div className="flex items-center gap-4 w-full">
                        <div className="size-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:-rotate-6 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div className="flex-1 min-w-0 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Location</label>
                            
                            {/* Invisible native select overlaid on top */}
                            <select 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 appearance-none cursor-pointer outline-none absolute inset-0 opacity-0 z-10 h-full"
                            >
                                <option>Select City</option>
                                {availableLocations.map((loc, i) => (
                                    <option key={i} value={loc}>{loc}</option>
                                ))}
                            </select>
                            
                            {/* Visible beautiful text */}
                            <div className="text-sm font-bold text-slate-800 truncate z-0 relative pointer-events-none">
                                {location}
                            </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                {/* 2. Price Range */}
                <div className="flex-1 w-full bg-transparent hover:bg-white rounded-[1.5rem] p-3 transition-all duration-300 group relative border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                    <div className="flex items-center gap-4 w-full">
                        <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div className="flex-1 min-w-0 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Budget</label>
                            
                            <select 
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 appearance-none cursor-pointer outline-none absolute inset-0 opacity-0 z-10 h-full"
                            >
                                <option>Any Price</option>
                                {availablePriceRanges.map((range, i) => (
                                    <option key={i} value={range.label}>{range.label}</option>
                                ))}
                            </select>
                            
                            <div className="text-sm font-bold text-slate-800 truncate z-0 relative pointer-events-none">
                                {priceRange}
                            </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                {/* 3. Facilities */}
                <div className="flex-1 w-full bg-transparent hover:bg-white rounded-[1.5rem] p-3 transition-all duration-300 group relative border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                    <div className="flex items-center gap-4 w-full">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:translate-y-[-2px] transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                        </div>
                        <div className="flex-1 min-w-0 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Facilities</label>
                            
                            <select 
                                value={facilities}
                                onChange={(e) => setFacilities(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 appearance-none cursor-pointer outline-none absolute inset-0 opacity-0 z-10 h-full"
                            >
                                <option>All</option>
                                {availableFacilities.map((fac, i) => (
                                    <option key={i} value={fac}>{fac}</option>
                                ))}
                            </select>
                            
                            <div className="text-sm font-bold text-slate-800 truncate z-0 relative pointer-events-none">
                                {facilities}
                            </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                {/* 4. Gender */}
                <div className="flex-1 w-full bg-transparent hover:bg-white rounded-[1.5rem] p-3 transition-all duration-300 group relative border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                    <div className="flex items-center gap-4 w-full">
                        <div className="size-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div className="flex-1 min-w-0 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Gender</label>
                            
                            <select 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 appearance-none cursor-pointer outline-none absolute inset-0 opacity-0 z-10 h-full"
                            >
                                <option>Mixed</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                            
                            <div className="text-sm font-bold text-slate-800 truncate z-0 relative pointer-events-none">
                                {gender}
                            </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-purple-500 transition-colors shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <div className="w-full md:w-auto p-1.5 md:pl-2">
                    <button 
                        onClick={handleSearch}
                        className="w-full md:w-auto bg-[#0B2E33] hover:bg-[#4F7C82] text-white px-10 py-4 md:py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-xl shadow-[#0B2E33]/20"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Search
                    </button>
                </div>

            </div>
        </div>
    );

}

