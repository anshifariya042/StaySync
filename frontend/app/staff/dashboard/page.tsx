"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { 
    getStaffStats, 
    getStaffTasks, 
    acceptTask, 
    updateTaskStatus 
} from "@/services/staffService";
import { 
    LayoutDashboard, 
    ClipboardList, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    MoreHorizontal,
    Droplets, // instead of Plumbing
    Zap, // for electrical
    Key, // for security
    Wrench,
    Bell,
    Menu
} from "lucide-react";


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

export default function StaffDashboard({ onMenuClick }: { onMenuClick?: () => void }) {
    const { profile } = useUserStore();

    const [stats, setStats] = useState<Stats | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [urgentTask, setUrgentTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsData, tasksData, highPriorityData] = await Promise.all([
                getStaffStats(),
                getStaffTasks({ limit: 20 }),
                getStaffTasks({ limit: 10 }) // This will fetch tasks for high/urgent check
            ]);
            
            setStats(statsData);
            setTasks(tasksData as Task[]);
            
            // Find the most urgent task (Urgent > High)
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
        // Setup polling for "real-time" data
        const interval = setInterval(fetchData, 30000); // 30 seconds
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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="p-2 text-slate-500 hover:text-blue-600 md:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-xs text-slate-500">Welcome back, {profile?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </button>
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-600/20 bg-slate-200">
                        <img 
                            alt="Profile" 
                            className="h-full w-full object-cover" 
                            src={profile?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                        />
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-5xl mx-auto space-y-8">
                {/* Welcome & Stats Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hello, {profile?.name?.split(' ')[0]}</h2>
                        <p className="text-slate-500 dark:text-slate-400">You have {stats?.pending} pending tasks for today.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-blue-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Total</span>
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.assigned || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Tasks</p>
                        </div>

                        <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-amber-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Waitlist</span>
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.waitlist || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Tasks</p>
                        </div>

                        <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Active</span>
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                    <Wrench className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.inProgress || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
                        </div>

                        <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-emerald-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Done</span>
                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.resolved || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
                        </div>
                    </div>
                </section>

                {/* Priority Task Highlight */}
                {urgentTask && (
                    <section>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">High Priority Task</h3>
                        <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-600/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                            {urgentTask.priority} Priority
                                        </span>
                                        <span className="text-white/60">•</span>
                                        <p className="text-sm text-white/80">Room {urgentTask.roomNumber}</p>
                                    </div>
                                    <h4 className="text-2xl font-bold leading-tight">{urgentTask.title}</h4>
                                    <p className="text-white/70 text-sm max-w-md line-clamp-1">{urgentTask.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-semibold">Reported {new Date(urgentTask.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {/* <button 
                                        onClick={() => handleMarkDone(urgentTask._id)}
                                        className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-lg"
                                    >
                                        View Details
                                    </button> */}
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>
                        </div>
                    </section>
                )}

                {/* Recent Tasks List */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Tasks</h3>
                        <Link href="/staff/tasks" className="text-sm font-bold text-blue-600 hover:underline">See All</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tasks.filter(t => t.status === 'In Progress').length > 0 ? (
                            tasks.filter(t => t.status === 'In Progress').map((task) => (
                                <div key={task._id} className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{task.title}</h4>
                                        <p className="text-xs font-medium text-slate-500">Room {task.roomNumber} • {task.category}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        task.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                        task.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {task.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                        {task.category === 'Plumbing' ? <Droplets className="w-3 h-3" /> :
                                         task.category === 'Electrical' ? <Zap className="w-3 h-3" /> :
                                         task.category === 'Security' ? <Key className="w-3 h-3" /> :
                                         <AlertCircle className="w-3 h-3" />}
                                        {task.category}
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {task.status === 'Pending' ? (
                                        <button 
                                            onClick={() => handleAcceptTask(task._id)}
                                            className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                        >
                                            Accept Task
                                        </button>
                                    ) : task.status === 'In Progress' ? (
                                        <button 
                                            onClick={() => handleMarkDone(task._id)}
                                            className="flex-1 rounded-xl border-2 border-blue-600 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            Mark as Resolved
                                        </button>
                                    ) : (
                                        <div className="flex-1 py-3 text-center text-xs font-bold text-slate-400 italic">
                                            Completed Task
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                        ) : (
                            <div className="md:col-span-2 py-12 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">No tasks currently in progress.</p>
                                <Link href="/staff/tasks" className="text-sm text-blue-600 mt-2 font-bold hover:underline">Check waitlist</Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
