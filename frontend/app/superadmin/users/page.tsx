'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '@/components/ui/StatsCard';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    hostelId?: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

interface Hostel {
    _id: string;
    name: string;
}

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [hostelFilter, setHostelFilter] = useState('All Hostels');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        pending: 0
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchHostels = async () => {
        try {
            const res = await api.get('/superadmin/hostels-list');
            setHostels(res.data);
        } catch (error) {
            console.error('Failed to fetch hostels list:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search,
                role: roleFilter,
                hostel: hostelFilter,
                page: page.toString(),
                limit: limit.toString()
            });
            const res = await api.get(`/superadmin/users?${params.toString()}`);
            setUsers(res.data.users);
            setStats({
                total: res.data.total,
                active: res.data.activeCount,
                pending: res.data.pendingCount
            });
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, roleFilter, hostelFilter, page]);

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'rejected' : 'active';
            await api.put(`/superadmin/users/status/${id}`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-emerald-500';
            case 'pending': return 'bg-amber-500';
            case 'rejected': return 'bg-rose-500';
            default: return 'bg-slate-400';
        }
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'staff': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'superadmin': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto min-h-screen">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0B2E33] tracking-tighter">Community <span className="text-[#4F7C82]/50">Directory</span></h1>
                    <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] mt-2 opacity-70">Oversee all registered platform participants</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-[#B8E3E9]/20 rounded-2xl border border-[#B8E3E9]/30">
                        <p className="text-[9px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">Total Population</p>
                        <p className="text-xl font-black text-[#0B2E33] leading-none mt-1">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard icon="group" label="Total" value={stats.total} subtext="Platform Users" index={0} />
                <StatsCard icon="check_circle" label="Active" value={stats.active} subtext="Live Accounts" index={1} />
                <StatsCard icon="pending" label="Pending" value={stats.pending} subtext="Awaiting Review" index={2} />
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F7C82] opacity-50" />
                    <input 
                        className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none rounded-[1.5rem] text-[13px] font-bold text-[#0B2E33] focus:ring-4 focus:ring-[#B8E3E9]/20 outline-none transition-all"
                        placeholder="Scan registry by name or email hash..." 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select 
                        className="flex-1 md:flex-none bg-[#F8FAFC] border-none rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest px-6 py-4 focus:ring-4 focus:ring-[#B8E3E9]/20 outline-none cursor-pointer text-[#0B2E33]"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Staff</option>
                        <option>User</option>
                    </select>

                    <select 
                        className="flex-1 md:flex-none bg-[#F8FAFC] border-none rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest px-6 py-4 focus:ring-4 focus:ring-[#B8E3E9]/20 outline-none cursor-pointer text-[#0B2E33]"
                        value={hostelFilter}
                        onChange={(e) => setHostelFilter(e.target.value)}
                    >
                        <option>All Hostels</option>
                        {hostels.map(hostel => (
                            <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Registry Table */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-50 relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">registry logs</h2>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] mt-1 opacity-70">Real-time system participant access</p>
                    </div>
                </div>

                <div className="overflow-x-auto -mx-8 md:-mx-10">
                    <table className="w-full text-left border-separate border-spacing-y-3 px-8 md:px-10">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] opacity-50 px-6">
                                <th className="pb-4 pl-6">Participant</th>
                                <th className="pb-4">Classification</th>
                                <th className="pb-4">Assigned Infrastructure</th>
                                <th className="pb-4">Security Status</th>
                                <th className="pb-4 text-right pr-6">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                                        <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-[#B8E3E9]">
                                        <Icon name="person_off" className="text-5xl text-[#B8E3E9] mb-4" />
                                        <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest">No matching logs identified</p>
                                    </td>
                                </tr>
                            ) : users.map((u, idx) => (
                                <motion.tr 
                                    key={u._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all group"
                                >
                                    <td className="py-5 pl-6 rounded-l-[1.5rem] border-y border-l border-transparent hover:border-[#B8E3E9]/30">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center font-black text-[#0B2E33] group-hover:scale-110 transition-transform">
                                                {u.name[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-black text-[#0B2E33] truncate leading-none">{u.name}</p>
                                                <p className="text-[11px] font-bold text-[#4F7C82] truncate opacity-60 mt-2">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white shadow-xs ${getRoleBadgeStyle(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        {u.hostelId ? (
                                            <div className="flex items-center gap-2 text-[#0B2E33]">
                                                <Icon name="apartment" className="text-lg opacity-40" />
                                                <p className="text-[11px] font-bold tracking-tight">{u.hostelId.name}</p>
                                            </div>
                                        ) : (
                                            <p className="text-[11px] font-bold text-[#4F7C82] opacity-40 uppercase tracking-widest">Standalone</p>
                                        )}
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(u.status)} shadow-sm`}></span>
                                            <span className="text-[11px] font-black text-[#0B2E33] uppercase tracking-widest">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 pr-6 text-right rounded-r-[1.5rem] border-y border-r border-transparent hover:border-[#B8E3E9]/30">
                                        <button 
                                            title={u.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                                            onClick={() => handleStatusToggle(u._id, u.status)}
                                            className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-white shadow-sm ${u.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                        >
                                            <Icon name={u.status === 'active' ? 'person_off' : 'person'} className="text-xl" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!loading && totalPages > 1 && (
                    <div className="mt-auto pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50">
                        <p className="text-[11px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">
                            Matrix Range <span className="text-[#0B2E33]">Page {page}</span> of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="size-11 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:scale-95 shadow-sm"
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
                                } else if (p === page - 2 || p === page + 2) {
                                    return <span key={p} className="text-[#4F7C82] font-black">...</span>;
                                }
                                return null;
                            })}

                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="size-11 rounded-2xl bg-white border border-[#B8E3E9]/30 flex items-center justify-center text-[#4F7C82] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:scale-95 shadow-sm"
                            >
                                <Icon name="chevron_right" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav Spacer */}
            <div className="h-20 lg:hidden"></div>
        </div>
    );
}
