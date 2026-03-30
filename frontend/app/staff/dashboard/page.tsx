"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { 
    getStaffStats, 
    getStaffTasks, 
    acceptTask, 
    updateTaskStatus 
} from "@/services/staffService";
import { useSidebarStore } from "@/store/useSidebarStore";
import { motion, AnimatePresence } from "framer-motion";
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

interface Stats {
    assigned: number;
    pending: number;
    inProgress: number;
    resolved: number;
    waitlist: number;
}

export default function StaffDashboard() {
    const { profile } = useUserStore();
    const { setIsOpen } = useSidebarStore();
    const router = useRouter();

    const [stats, setStats] = useState<Stats | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [urgentTask, setUrgentTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsData, tasksData, highPriorityData] = await Promise.all([
                getStaffStats(),
                getStaffTasks({ limit: 20 }),
                getStaffTasks({ limit: 10 }) 
            ]);
            
            setStats(statsData);
            setTasks(tasksData as Task[]);
            
            const allFetched = [...(tasksData as Task[]), ...(highPriorityData as Task[])];
            const urgent = allFetched.find(t => t.priority === "Urgent" && t.status !== "Resolved") || 
                           allFetched.find(t => t.priority === "High" && t.status !== "Resolved");
                           
            setUrgentTask(urgent || null);
        } catch (error) {
            console.error("Failed to fetch staff data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); 
        return () => clearInterval(interval);
    }, []);

    const handleAcceptTask = async (taskId: string) => {
        try {
            await acceptTask(taskId);
            fetchData();
        } catch (error) {
            alert("Failed to accept task");
        }
    };

    const handleMarkDone = async (taskId: string) => {
        try {
            await updateTaskStatus(taskId, "Resolved");
            fetchData();
        } catch (error) {
            alert("Failed to update task");
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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased">
             <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>
            
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#B8E3E9]/20 bg-[#F8FAFC]/80 backdrop-blur-md px-6 md:px-10 py-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="lg:hidden size-12 flex items-center justify-center bg-white border border-[#B8E3E9] rounded-2xl text-[#4F7C82] hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                    >
                        <Icon name="menu" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#0B2E33] tracking-tighter">Dashboard</h1>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] opacity-60 mt-0.5">Welcome back, {profile?.name}</p>
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

            <main className="p-4 md:p-10 max-w-6xl mx-auto space-y-12">
                {/* Stats Section */}
                <section>
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-[#0B2E33] tracking-tight">Active Operations</h2>
                        <p className="text-[#4F7C82] mt-1.5 font-bold text-sm uppercase tracking-widest opacity-80">Current performance overview</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br from-[#B8E3E9]/60 to-[#F8FAFC] relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl text-[#0B2E33] flex items-center justify-center shadow-sm">
                                    <Icon name="assignment" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-[#0B2E33]">Assigned</span>
                            </div>
                            <p className="text-5xl font-black text-[#0B2E33] tracking-tighter">{stats?.assigned || 0}</p>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 text-[#0B2E33]">Total Tasks</p>
                            <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                            className="rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br from-[#4F7C82]/20 to-[#B8E3E9]/10 relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl text-[#4F7C82] flex items-center justify-center shadow-sm">
                                    <Icon name="history" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-[#4F7C82]">Waitlist</span>
                            </div>
                            <p className="text-5xl font-black text-[#4F7C82] tracking-tighter">{stats?.waitlist || 0}</p>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 text-[#4F7C82]">Available Jobs</p>
                            <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            className="rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br from-[#B8E3E9]/40 to-indigo-50/30 relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl text-indigo-800 flex items-center justify-center shadow-sm">
                                    <Icon name="engineering" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-indigo-800">Active</span>
                            </div>
                            <p className="text-5xl font-black text-indigo-900 tracking-tighter">{stats?.inProgress || 0}</p>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 text-indigo-800">In Progress</p>
                            <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                            className="rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br from-[#4F7C82]/10 to-[#B8E3E9]/30 relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl text-emerald-800 flex items-center justify-center shadow-sm">
                                    <Icon name="check_circle" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-emerald-800">Done</span>
                            </div>
                            <p className="text-5xl font-black text-emerald-900 tracking-tighter">{stats?.resolved || 0}</p>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 text-emerald-800">Resolved</p>
                            <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </motion.div>
                    </div>
                </section>

                {/* Priority Highlight */}
                {urgentTask && (
                    <section>
                         <div className="relative overflow-hidden rounded-[3rem] bg-[#0B2E33] p-10 md:p-14 text-white shadow-2xl shadow-[#0B2E33]/30 border border-white/5">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="rounded-xl bg-[#4F7C82] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10">
                                            {urgentTask.priority} Priority
                                        </span>
                                        <span className="text-white/20 font-black">/</span>
                                        <p className="text-xs font-black uppercase tracking-widest text-[#B8E3E9]">Unit {urgentTask.roomNumber}</p>
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tighter leading-none">{urgentTask.title}</h4>
                                    <p className="text-[#B8E3E9]/60 text-[15px] font-medium max-w-xl leading-relaxed">{urgentTask.description}</p>
                                </div>
                                <div className="shrink-0">
                                     <button className="w-full md:w-auto px-10 py-5 bg-white text-[#0B2E33] rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-white/5 hover:scale-105 transition-all active:scale-95">
                                        Analyze Task
                                    </button>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -right-20 -top-20 size-64 bg-[#4F7C82]/20 rounded-full blur-[100px]"></div>
                            <div className="absolute -left-20 -bottom-20 size-64 bg-[#B8E3E9]/10 rounded-full blur-[100px]"></div>
                        </div>
                    </section>
                )}

                {/* Task Logs */}
                <section>
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-[#0B2E33] tracking-tighter">Maintenance Logs</h3>
                            <p className="text-xs font-bold text-[#4F7C82] uppercase tracking-[0.1em] mt-1 opacity-70">Latest tracking updates</p>
                        </div>
                        {/* <Link href="/staff/tasks" className="px-6 py-2.5 bg-[#B8E3E9]/30 text-[#4F7C82] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B8E3E9]/50 transition-all active:scale-95">System View</Link> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tasks.filter(t => t.status === 'In Progress').length > 0 ? (
                            tasks.filter(t => t.status === 'In Progress').map((task, idx) => (
                                <motion.div 
                                    key={task._id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#4F7C82]/10 transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-black text-[#0B2E33] text-2xl tracking-tighter leading-none group-hover:text-[#4F7C82] transition-colors">{task.title}</h4>
                                            <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest mt-2 bg-[#B8E3E9]/30 px-2 py-0.5 rounded-md inline-block">Room {task.roomNumber} • {task.category}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-white ${
                                            task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#B8E3E9]/40 text-[#4F7C82]'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 mb-10 relative z-10">
                                        <div className="size-14 rounded-2xl bg-[#B8E3E9]/20 flex items-center justify-center text-[#4F7C82] border border-[#B8E3E9]/30 group-hover:scale-110 group-hover:bg-[#B8E3E9]/40 transition-all duration-500">
                                             <Icon name={getIconForCategory(task.category)} className="text-2xl" />
                                        </div>
                                        <div>
                                             <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">Created At</p>
                                             <p className="text-sm font-black text-[#0B2E33]">{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 relative z-10">
                                        <button 
                                            onClick={() => handleMarkDone(task._id)}
                                            className="w-full py-4 bg-[#0B2E33] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#0B2E33]/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Submit Resolution
                                        </button>
                                    </div>
                                    
                                    <div className="absolute -right-10 -bottom-10 size-40 bg-[#B8E3E9]/10 rounded-full blur-3xl group-hover:bg-[#B8E3E9]/20 transition-all duration-1000"></div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="md:col-span-2 py-24 text-center bg-white rounded-[3rem] border border-dashed border-[#B8E3E9]">
                                <Icon name="verified_user" className="text-6xl text-[#B8E3E9] mb-4 opacity-50" />
                                <p className="text-[#4F7C82] font-black uppercase tracking-widest text-xs opacity-60">No active maintenance threads</p>
                                <Link href="/staff/tasks" className="text-[10px] text-[#0B2E33] mt-4 font-black uppercase tracking-[0.2em] bg-[#B8E3E9]/50 px-6 py-2 rounded-xl inline-block hover:bg-[#B8E3E9] transition-all">Scan Available Jobs</Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
