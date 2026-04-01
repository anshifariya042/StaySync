'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getHostelApprovals, approveRejectHostel } from '@/services/superAdminService';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Hostel {
    _id: string;
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    totalRooms: number;
    price: number;
    facilities: string[];
    roomTypes: string[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    images?: string[];
}

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function HostelApprovalsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-[#4F7C82]">Validating Approval Matrix...</div>}>
            <ApprovalsContent />
        </Suspense>
    );
}

function ApprovalsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'all');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    
    // Pagination state
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const limit = 8;

    // Modal state
    const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

    // Show toast then clear it
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery !== debouncedSearch) setPage(1); // Reset to first page ONLY on change
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, debouncedSearch]);

    // Sync URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.set('status', filterStatus);
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (page > 1) params.set('page', page.toString());
        
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    }, [filterStatus, debouncedSearch, page, pathname, router]);

    const fetchHostels = async () => {
        try {
            setLoading(true);
            const data = await getHostelApprovals(filterStatus, debouncedSearch, page, limit);
            setHostels(data.hostels);
            setTotalPages(data.totalPages);
            setTotalResults(data.total);
        } catch (error: any) {
            console.error("Failed to fetch hostels", error);
            setToast({ message: "Failed to load hostel registration list", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();

        const handleRefresh = () => {
            console.log("🔄 Real-time refresh triggered for hostel approvals...");
            fetchHostels();
        };

        window.addEventListener('refresh_hostel_registrations', handleRefresh);
        return () => window.removeEventListener('refresh_hostel_registrations', handleRefresh);
    }, [filterStatus, debouncedSearch, page]);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        try {
            const confirmed = window.confirm(`Are you sure you want to ${action === 'approved' ? 'Approve' : 'Reject'} this hostel?`);
            if (!confirmed) return;

            await approveRejectHostel(id, action);
            setToast({ message: `Hostel ${action} successfully`, type: 'success' });
            setSelectedHostel(null); // Close modal if open
            fetchHostels();
        } catch (error: any) {
            console.error(`Failed to ${action} hostel`, error);
            setToast({ message: error.response?.data?.message || `Failed to ${action} hostel`, type: 'error' });
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-[#FFF9EB] text-[#B47D1B] border-[#FDECB1]';
            case 'approved':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="p-4 md:p-10 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* Filters & Search Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => { setFilterStatus(status); setPage(1); }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                    filterStatus === status
                                        ? 'bg-[#0B2E33] text-white border-[#0B2E33] shadow-lg shadow-[#0B2E33]/20'
                                        : 'bg-white text-[#4F7C82] border-slate-100 hover:border-[#B8E3E9] hover:bg-slate-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:max-w-sm">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F7C82] opacity-50" />
                        <input
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#B8E3E9]/30 rounded-2xl text-[13px] font-bold text-[#0B2E33] focus:ring-4 focus:ring-[#B8E3E9]/20 focus:border-[#4F7C82] outline-none shadow-sm transition-all"
                            placeholder="Search by name, owner or city..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-50 relative overflow-hidden min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">registrations</h2>
                            <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] mt-1 opacity-70">Review and approve vendor accounts</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#4F7C82] opacity-50 uppercase tracking-widest">
                                {totalResults} entries found
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-24">
                            <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mb-6"></div>
                            <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em]">Retrieving secure records...</p>
                        </div>
                    ) : hostels.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-24 bg-[#F8FAFC] rounded-[2rem] border border-dashed border-[#B8E3E9]">
                            <Icon name="search_off" className="text-5xl text-[#B8E3E9] mb-4" />
                            <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest">No matching registrations</p>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-4">
                            {hostels.map((hostel, idx) => (
                                <motion.div 
                                    key={hostel._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] hover:border-[#B8E3E9]/30 transition-all duration-300 gap-5 group"
                                >
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="size-16 rounded-[1.5rem] bg-white flex-shrink-0 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-all duration-500">
                                            {hostel.images && hostel.images[0] ? (
                                                <img 
                                                    src={hostel.images[0].startsWith('http') ? hostel.images[0] : `http://localhost:5000/${hostel.images[0]}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Hostel"
                                                />
                                            ) : (
                                                <Icon name="apartment" className="text-[#4F7C82] text-2xl" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-lg text-[#0B2E33] group-hover:text-[#4F7C82] transition-colors leading-tight truncate">{hostel.name}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                    <Icon name="person" className="text-xs" /> {hostel.ownerName}
                                                </p>
                                                <span className="text-slate-200 hidden sm:inline">/</span>
                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                    <Icon name="location_on" className="text-xs" /> {hostel.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xs border ${getStatusStyles(hostel.status)}`}>
                                            {hostel.status}
                                        </span>
                                        <button 
                                            onClick={() => setSelectedHostel(hostel)}
                                            className="flex-1 md:flex-none px-6 py-3 bg-[#0B2E33] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0B2E33]/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Footer */}
                    {!loading && totalResults > 0 && (
                        <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <p className="text-[11px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">
                                Page <span className="text-[#0B2E33]">{page}</span> of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="size-12 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:scale-95"
                                >
                                    <Icon name="chevron_left" />
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Show first, last, and pages around current
                                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`size-12 rounded-2xl text-xs font-black transition-all ${
                                                    page === p 
                                                        ? 'bg-[#0B2E33] text-white shadow-md' 
                                                        : 'bg-white text-[#4F7C82] border border-[#B8E3E9]/30 hover:border-[#4F7C82]'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-[#4F7C82]">...</span>;
                                    }
                                    return null;
                                })}

                                <button 
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="size-12 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:scale-95"
                                >
                                    <Icon name="chevron_right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            <AnimatePresence>
                {selectedHostel && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedHostel(null)}
                            className="absolute inset-0 bg-[#0B2E33]/30 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header/Image */}
                            <div className="h-64 relative bg-[#0B2E33] shrink-0">
                                {selectedHostel.images && selectedHostel.images[0] ? (
                                    <img 
                                        src={selectedHostel.images[0].startsWith('http') ? selectedHostel.images[0] : `http://localhost:5000/${selectedHostel.images[0]}`}
                                        className="w-full h-full object-cover opacity-60"
                                        alt="Banner"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E33] to-transparent" />
                                <button 
                                    onClick={() => setSelectedHostel(null)}
                                    className="absolute top-6 right-6 size-12 rounded-2xl bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-95"
                                >
                                    <Icon name="close" />
                                </button>
                                <div className="absolute bottom-8 left-10">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 text-white mb-4 inline-block ${
                                        selectedHostel.status === 'pending' ? 'bg-amber-500/50' : selectedHostel.status === 'approved' ? 'bg-emerald-500/50' : 'bg-rose-500/50'
                                    }`}>
                                        {selectedHostel.status} Status
                                    </span>
                                    <h2 className="text-4xl font-black text-white tracking-tighter">{selectedHostel.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-white/70">
                                        <p className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                                            <Icon name="location_on" className="text-lg" /> {selectedHostel.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <section>
                                            <h4 className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-4">Ownership Information</h4>
                                            <div className="flex items-center gap-5 p-5 bg-[#F8FAFC] rounded-[2rem] border border-slate-50">
                                                <div className="size-14 rounded-2xl bg-[#0B2E33] text-white flex items-center justify-center font-black text-lg">
                                                    {selectedHostel.ownerName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#0B2E33] text-lg leading-none">{selectedHostel.ownerName}</p>
                                                    <div className="flex flex-col mt-2.5 space-y-1">
                                                        <span className="text-[11px] font-bold text-[#4F7C82] flex items-center gap-2">
                                                            <Icon name="mail" className="text-base" /> {selectedHostel.email}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-[#4F7C82] flex items-center gap-2">
                                                            <Icon name="call" className="text-base" /> {selectedHostel.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-4">Property Capacity</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-[#B8E3E9]/20 rounded-[2rem] border border-[#B8E3E9]/30">
                                                    <Icon name="bed" className="text-[#0B2E33] mb-2" />
                                                    <p className="text-2xl font-black text-[#0B2E33]">{selectedHostel.totalRooms}</p>
                                                    <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-widest mt-1">Total Rooms</p>
                                                </div>
                                                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                                                    <Icon name="payments" className="text-emerald-600 mb-2" />
                                                    <p className="text-2xl font-black text-emerald-600">${selectedHostel.price}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Starting Price</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-8">
                                        <section>
                                            <h4 className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-4">Description</h4>
                                            <p className="text-sm leading-relaxed text-[#4F7C82] font-medium bg-[#F8FAFC] p-6 rounded-[2rem] border border-slate-50 italic">
                                                "{selectedHostel.description || 'No description provided by the owner yet.'}"
                                            </p>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-4">Amenities Provided</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedHostel.facilities.map(f => (
                                                    <span key={f} className="px-4 py-2 bg-white border border-[#B8E3E9]/30 rounded-xl text-[10px] font-black text-[#0B2E33] uppercase tracking-widest">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Images Section */}
                                {selectedHostel.images && selectedHostel.images.length > 1 && (
                                    <section>
                                        <h4 className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-6">Gallery Preview</h4>
                                        <div className="grid grid-cols-4 gap-4">
                                            {selectedHostel.images.slice(1, 5).map((img, i) => (
                                                <div key={i} className="aspect-square rounded-[1.5rem] bg-slate-100 border border-slate-200 overflow-hidden">
                                                    <img 
                                                        src={img.startsWith('http') ? img : `http://localhost:5000/${img}`}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                        alt={`Gallery ${i}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="p-10 border-t border-slate-50 bg-[#F8FAFC]/50 flex items-center justify-end gap-4">
                                <button
                                    onClick={() => setSelectedHostel(null)}
                                    className="px-8 py-3.5 bg-white text-[#4F7C82] border border-[#B8E3E9] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Dismiss
                                </button>
                                
                                {selectedHostel.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleAction(selectedHostel._id, 'rejected')}
                                        className="px-8 py-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                                    >
                                        Reject Property
                                    </button>
                                )}

                                {selectedHostel.status !== 'approved' && (
                                    <button
                                        onClick={() => handleAction(selectedHostel._id, 'approved')}
                                        className="px-10 py-3.5 bg-[#0B2E33] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0B2E33]/30 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Approve Access
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
                            toast.type === 'success' ? 'bg-[#0B2E33] text-[#B8E3E9]' : 'bg-rose-600 text-white'
                        }`}
                    >
                        <Icon name={toast.type === 'success' ? 'verified' : 'error'} />
                        <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
