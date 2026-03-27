'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '@/components/ui/StatsCard';

interface Staff {
    _id: string;
    name: string;
}

interface Complaint {
    _id: string;
    complaintId: string;
    title: string;
    description?: string;
    category: string;
    status: string;
    priority: string;
    hostelId: {
        _id: string;
        name: string;
    };
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    assignedStaff? : Staff;
    createdAt: string;
}

interface CategoryStat {
    _id: string;
    count: number;
}

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function SuperAdminComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        categories: [] as CategoryStat[]
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search,
                status: statusFilter,
                category: categoryFilter,
                page: page.toString(),
                limit: '8'
            });
            const res = await api.get(`/superadmin/complaints?${params.toString()}`);
            setComplaints(res.data.complaints);
            setStats(res.data.stats);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchComplaints();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, statusFilter, categoryFilter, page]);

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'in progress':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'resolved':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const totalCategoryCount = stats.categories.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto min-h-screen">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0B2E33] tracking-tighter">System <span className="text-[#4F7C82]/50">Resolver</span></h1>
                    <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] mt-2 opacity-70">Cross-platform maintenance and issue monitoring</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-[#B8E3E9]/30 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#0B2E33] shadow-sm hover:bg-[#F8FAFC] transition-all active:scale-95">
                        <Icon name="filter_list" className="text-lg" /> Filter Matrix
                    </button>
                    <button className="flex items-center gap-3 px-6 py-4 bg-[#0B2E33] rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#0B2E33]/20 hover:scale-105 transition-all active:scale-95">
                        <Icon name="download" className="text-lg" /> Export Logs
                    </button>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon="inbox" label="Aggregated" value={stats.total} subtext="Total Reports" index={0} />
                <StatsCard icon="pending_actions" label="Pending" value={stats.pending} subtext="Awaiting Triage" index={1} />
                <StatsCard icon="construction" label="Active" value={stats.inProgress} subtext="Under Resolution" index={2} />
                <StatsCard icon="check_circle" label="Resolved" value={stats.resolved} subtext="Closed Tickets" index={3} />
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Categories Bar Chart UI */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">category distribution</h2>
                            <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] mt-1 opacity-70">Infrastructure issue types</p>
                        </div>
                        <span className="text-[10px] font-black text-[#4F7C82] opacity-40 uppercase tracking-widest">Platform-wide</span>
                    </div>
                    
                    <div className="space-y-8">
                        {stats.categories.length === 0 ? (
                            <div className="py-20 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-[#B8E3E9]">
                                <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest opacity-40">No data synchronized</p>
                            </div>
                        ) : stats.categories.sort((a,b) => b.count - a.count).map((cat, i) => {
                            const percentage = totalCategoryCount > 0 ? Math.round((cat.count / totalCategoryCount) * 100) : 0;
                            return (
                                <div key={cat._id}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] font-black text-[#0B2E33] uppercase tracking-widest">{cat._id}</span>
                                        <span className="text-[11px] font-black text-[#4F7C82]">{percentage}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-slate-50">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className={`h-full rounded-full ${i % 3 === 0 ? 'bg-[#0B2E33]' : i % 2 === 0 ? 'bg-[#4F7C82]' : 'bg-[#B8E3E9]'}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Trends Visualization Mockup */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">resolution frequency</h2>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                <span className="text-[10px] font-black uppercase tracking-widest">stable</span>
                                <Icon name="trending_flat" className="text-base" />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] opacity-70">Daily average: 12.4 resolutions</p>
                    </div>

                    <div className="h-56 relative mt-10">
                        {/* Area Gradient Visualization */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                            <defs>
                                <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#0B2E33" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0B2E33" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0 130 Q 50 100, 100 110 T 200 60 T 300 90 T 400 40 V 150 H 0 Z" fill="url(#trendGradient)" />
                            <path d="M0 130 Q 50 100, 100 110 T 200 60 T 300 90 T 400 40" fill="none" stroke="#0B2E33" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <div className="flex justify-between mt-6 px-2">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <span key={day} className="text-[9px] font-black text-[#4F7C82] uppercase tracking-widest opacity-40">{day}</span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Complaints Registry */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-50 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">recent tickets</h2>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] mt-1 opacity-70">Chronological platform issues</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F7C82] opacity-50" />
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none rounded-[1.5rem] text-[12px] font-bold text-[#0B2E33] focus:ring-4 focus:ring-[#B8E3E9]/20 outline-none transition-all"
                            placeholder="Find logs by ID or description..." 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto -mx-8 md:-mx-10 px-8 md:px-10">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] opacity-50 px-6">
                                <th className="pb-4 pl-6">Token ID</th>
                                <th className="pb-4">Infrastructure</th>
                                <th className="pb-4">Classification</th>
                                <th className="pb-4">Security Level</th>
                                <th className="pb-4">Allocated Staff</th>
                                <th className="pb-4 text-right pr-6">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                                        <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em]">Synchronizing Logs...</p>
                                    </td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-[#B8E3E9]">
                                        <Icon name="verified" className="text-5xl text-[#B8E3E9] mb-4" />
                                        <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest">Platform is operating normally</p>
                                    </td>
                                </tr>
                            ) : complaints.map((c, idx) => (
                                <motion.tr 
                                    key={c._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all group"
                                >
                                    <td className="py-5 pl-6 rounded-l-[1.5rem] border-y border-l border-transparent">
                                        <p className="text-[11px] font-black text-[#0B2E33] tracking-tighter uppercase">{c.complaintId}</p>
                                        <p className="text-[12px] font-bold text-[#4F7C82] truncate max-w-[150px] opacity-60 mt-1">{c.title}</p>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2">
                                            <Icon name="apartment" className="text-sm opacity-40 text-[#0B2E33]" />
                                            <p className="text-[12px] font-black text-[#0B2E33] leading-none">{c.hostelId?.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#4F7C82] opacity-60 bg-white px-3 py-1 rounded-lg border border-[#B8E3E9]/30 shadow-xs">
                                            {c.category}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white shadow-xs ${getStatusStyles(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        {c.assignedStaff ? (
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-10 rounded-xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center font-black text-[#0B2E33] text-[9px]">
                                                    {c.assignedStaff.name[0]}
                                                </div>
                                                <p className="text-[11px] font-bold text-[#0B2E33]">{c.assignedStaff.name}</p>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-[#4F7C82] opacity-40 uppercase tracking-widest">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="py-5 pr-6 text-right rounded-r-[1.5rem] border-y border-r border-transparent">
                                        <button className="size-10 rounded-xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-[#0B2E33] hover:text-white transition-all active:scale-95 shadow-sm">
                                            <Icon name="more_vert" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Matrix */}
                {!loading && totalPages > 1 && (
                    <div className="mt-10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50">
                        <p className="text-[11px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">
                            Matrix Frame <span className="text-[#0B2E33]">Sector {page}</span> of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="size-11 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                            >
                                <Icon name="chevron_left" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const p = i + 1;
                                if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`size-11 rounded-2xl text-[11px] font-black transition-all ${
                                                page === p 
                                                    ? 'bg-[#0B2E33] text-white shadow-lg shadow-[#0B2E33]/20' 
                                                    : 'bg-white text-[#4F7C82] border border-[#B8E3E9]/30 hover:border-[#4F7C82]'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                }
                                return null;
                            })}

                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="size-11 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                            >
                                <Icon name="chevron_right" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Spacer */}
            <div className="h-20 lg:hidden"></div>
        </div>
    );
}
