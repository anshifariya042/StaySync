'use client';

import Link from 'next/link';
import { useFeaturedHostels } from '@/hooks/useHostel';

interface Hostel {
    _id: string;
    name: string;
    price: number;
    location: string;
    rating?: number;
    images: string[];
}

export default function FeaturedHostels() {
    const { data: hostels = [], isLoading } = useFeaturedHostels(3);

    return (
        <section className="container mx-auto px-6 py-24" id="hostels">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h2 className="text-[2rem] font-extrabold text-foreground mb-2">Featured Hostels</h2>
                    <p className="text-text-gray text-base">Handpicked stays with verified reviews and premium facilities.</p>
                </div>
                <Link href="/explore-hostels" className="text-primary-blue font-bold flex items-center gap-2 hover:underline">
                    View All &rarr;
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border-color p-4 animate-pulse">
                            <div className="w-full h-[220px] bg-gray-200 rounded-xl mb-5"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {hostels.map((hostel: any) => (
                        <div key={hostel._id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:translate-y-[-5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all border border-border-color p-4 flex flex-col">
                            <div className="relative w-full h-[220px] rounded-xl overflow-hidden mb-5">
                                <img 
                                    src={hostel.images?.[0] || '/hero_room.png'} 
                                    alt={hostel.name} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full text-[0.75rem] font-bold flex items-center gap-1.5 text-foreground shadow-lg shadow-black/5 border border-white/20">
                                    <svg className="text-[#f59e0b]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    4.5
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-foreground line-clamp-1">{hostel.name}</h3>
                                    <div className="text-xl font-extrabold text-primary-blue-light shrink-0">
                                        {hostel.price}
                                        <span className="text-[0.85rem] font-medium text-text-gray">/mo</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-text-gray text-[0.9rem] mb-4">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {hostel.location}
                                </div>

                                <div className="flex gap-3 mb-6 text-[#9ca3af] mt-auto">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                                </div>

                                <Link 
                                    href={`/hostel/${hostel._id}`} 
                                    className="w-full py-3 bg-white border border-[#f3f4f6] rounded-xl font-bold text-[0.9rem] text-foreground hover:bg-gray-50 hover:border-gray-200 transition-all text-center block"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                    {!isLoading && hostels.length === 0 && (
                        <p className="col-span-full text-center text-text-gray">No featured hostels available at the moment.</p>
                    )}
                </div>
            )}
        </section>
    );
}
