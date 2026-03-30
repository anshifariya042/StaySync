"use client";

import React, { useEffect, useState } from "react";
import { getStaffTasks, acceptTask, updateTaskStatus } from "@/services/staffService";
import { useSidebarStore } from "@/store/useSidebarStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

interface Task {
    _id: string;
    complaintId: string;
    title: string;
    description: string;
    roomNumber: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    userId: {
        name: string;
        email: string;
    };
}

export default function StaffTasksPage() {
    const { profile } = useUserStore();
    const router = useRouter();
    const { setIsOpen } = useSidebarStore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await getStaffTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === "All" || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                               task.roomNumber.includes(search) ||
                               task.complaintId.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleAccept = async (id: string) => {
        try {
            await acceptTask(id);
            fetchTasks();
        } catch (error) {
            alert("Error accepting task");
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await updateTaskStatus(id, "Resolved");
            fetchTasks();
        } catch (error) {
            alert("Error resolving task");
        }
    };

    const getIconForCategory = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'plumbing': return 'plumbing';
            case 'electrical': return 'electrical_services';
            case 'wifi': return 'wifi';
            case 'ac': return 'ac_unit';
            default: return 'description';
        }
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC] font-display text-[#0B2E33] antialiased">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#B8E3E9]/20 bg-[#F8FAFC]/80 backdrop-blur-md px-6 md:px-10 py-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="lg:hidden size-12 flex items-center justify-center bg-white border border-[#B8E3E9] rounded-2xl text-[#4F7C82] hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                    >
                        <Icon name="menu" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#0B2E33] tracking-tighter">Task Management</h1>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] opacity-60 mt-0.5">Assigned Maintenance Threads</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <NotificationDropdown />
                    <div 
                        onClick={() => router.push('/staff/profile')}
                        className="size-12 rounded-2xl border-4 border-white shadow-lg bg-slate-100 bg-center bg-cover overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}
                        >
                        {!profile?.profileImage && (
                            <div className="size-full flex items-center justify-center text-[#4F7C82] font-black bg-white">
                                {profile?.name?.charAt(0) || 'S'}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="p-4 md:p-10 space-y-8">
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                    <div className="relative w-full lg:w-[400px]">
                        <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4F7C82] opacity-40" />
                        <input 
                            type="text" 
                            placeholder="Filter by title, room, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 rounded-2xl border border-slate-100 bg-white text-sm font-black text-[#0B2E33] placeholder:opacity-30 focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border border-white ${
                                    filter === s 
                                        ? "bg-[#0B2E33] text-white shadow-xl shadow-[#0B2E33]/20" 
                                        : "bg-white text-[#4F7C82] hover:bg-[#B8E3E9]/20"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasks List Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10">
                {loading ? (
                    <div className="py-24 text-center">
                        <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                        <p className="text-sm font-black text-[#4F7C82] uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-[#B8E3E9]">
                        <Icon name="inbox" className="text-6xl text-[#B8E3E9] mb-4 opacity-50" />
                        <p className="text-[#4F7C82] font-black uppercase tracking-widest text-xs opacity-60">No matching tasks indexed</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
                        {filteredTasks.map((task, idx) => (
                            <motion.div 
                                key={task._id} 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-slate-50 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-2xl hover:shadow-[#4F7C82]/10 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="flex gap-6 items-start flex-1 min-w-0 relative z-10">
                                    <div className={`size-16 rounded-[1.5rem] shrink-0 flex items-center justify-center border border-white shadow-md group-hover:scale-110 transition-transform duration-500 ${
                                        task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                                        task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' :
                                        'bg-[#B8E3E9]/20 text-[#4F7C82]'
                                    }`}>
                                        <Icon name={getIconForCategory(task.category)} className="text-2xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black text-[#4F7C82] opacity-40 uppercase tracking-widest">{task.complaintId}</span>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ring-1 ring-white ${
                                                (task.priority === 'High' || task.priority === 'Urgent') ? 'bg-red-50 text-red-600' :
                                                task.priority === 'Normal' ? 'bg-[#B8E3E9]/30 text-[#4F7C82]' :
                                                'bg-slate-50 text-slate-600'
                                            }`}>
                                                {task.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-[#0B2E33] tracking-tighter leading-tight truncate uppercase mb-1">{task.title}</h3>
                                        <p className="text-sm font-medium text-[#4F7C82] opacity-70 line-clamp-1 mb-4">{task.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#4F7C82]/50">
                                            <span className="flex items-center gap-2"><Icon name="schedule" className="text-sm" /> {new Date(task.createdAt).toLocaleDateString()}</span>
                                            <span className="opacity-20">/</span>
                                            <span className="flex items-center gap-2"><Icon name="location_on" className="text-sm" /> Room {task.roomNumber}</span>
                                            <span className="opacity-20">/</span>
                                            <span className="text-[#0B2E33] opacity-60 flex items-center gap-2"><Icon name="person" className="text-sm" /> {task.userId?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 relative z-10">
                                    {task.status === 'Pending' ? (
                                        <button 
                                            onClick={() => handleAccept(task._id)}
                                            className="px-8 py-4 rounded-2xl bg-[#0B2E33] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0B2E33]/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Accept Task
                                        </button>
                                    ) : task.status === 'In Progress' ? (
                                        <button 
                                            onClick={() => handleResolve(task._id)}
                                            className="px-8 py-4 rounded-2xl border-4 border-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50/50 transition-all active:scale-95 shadow-sm"
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm border border-white">
                                            <Icon name="verified" className="text-lg" />
                                            resolved
                                        </div>
                                    )}
                                
                                </div>
                                
                                {/* Decor */}
                                <div className="absolute -right-10 -bottom-10 size-40 bg-[#B8E3E9]/10 rounded-full blur-3xl group-hover:bg-[#B8E3E9]/20 transition-all duration-1000"></div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
