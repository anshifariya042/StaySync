"use client";

import React, { useEffect, useState } from "react";
import { getStaffTasks, acceptTask, updateTaskStatus } from "@/services/staffService";
import { 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MoreHorizontal,
    Droplets,
    Zap,
    Key,
    Wrench,
    Menu,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

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

export default function StaffTasksPage({ onMenuClick }: { onMenuClick?: () => void }) {
    const { profile } = useUserStore();
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

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="p-2 text-slate-500 hover:text-blue-600 md:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Task Management</h1>
                        <p className="text-xs text-slate-500">View and manage assigned complaints</p>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="p-4 md:p-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by title, room, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    filter === s 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                        : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-500"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasks List Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No tasks found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredTasks.map((task) => (
                            <div 
                                key={task._id} 
                                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
                            >
                                <div className="flex gap-4 items-start flex-1 min-w-0">
                                    <div className={`p-4 rounded-2xl shrink-0 ${
                                        task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10' :
                                        task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/10' :
                                        'bg-amber-50 text-amber-600 dark:bg-amber-900/10'
                                    }`}>
                                        {task.category === 'Plumbing' ? <Droplets className="w-6 h-6" /> :
                                         task.category === 'Electrical' ? <Zap className="w-6 h-6" /> :
                                         task.category === 'Security' ? <Key className="w-6 h-6" /> :
                                         <Wrench className="w-6 h-6" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.complaintId}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                (task.priority === 'High' || task.priority === 'Urgent') ? 'bg-red-50 text-red-600' :
                                                task.priority === 'Normal' ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-50 text-slate-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors uppercase">{task.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{task.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(task.createdAt).toLocaleDateString()}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span>Room {task.roomNumber}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span className="text-slate-600 dark:text-slate-300">{task.userId?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {task.status === 'Pending' ? (
                                        <button 
                                            onClick={() => handleAccept(task._id)}
                                            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            Accept Task
                                        </button>
                                    ) : task.status === 'In Progress' ? (
                                        <button 
                                            onClick={() => handleResolve(task._id)}
                                            className="px-6 py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 text-sm font-bold hover:bg-emerald-50 transition-all"
                                        >
                                            Complete Task
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm px-4">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Resolved
                                        </div>
                                    )}
                                    <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
