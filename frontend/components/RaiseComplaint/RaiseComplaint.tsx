"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useSubmitComplaint } from '@/hooks/useUserComplaints'
import { useProfile } from '@/hooks/useProfile'

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined align-middle ${className}`}>{name}</span>
)

export default function RaiseComplaint() {
    const router = useRouter()
    const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: fullUser } = useProfile()
    const submitComplaintMutation = useSubmitComplaint()

    const [formData, setFormData] = useState({
        category: '',
        priority: 'Normal',
        title: '',
        description: '',
        images: [] as File[]
    })

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.title || !formData.description) {
            setStatus({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }

        try {
            const data = new FormData();
            data.append('category', formData.category);
            data.append('priority', formData.priority);
            data.append('title', formData.title);
            data.append('description', formData.description);
            formData.images.forEach(image => data.append('images', image));
            
            if (!fullUser?.hostelId) {
                setStatus({ type: 'error', message: 'Resident status required.' });
                return;
            }

            await submitComplaintMutation.mutateAsync(data);
            setStatus({ type: 'success', message: 'Ticket submitted successfully.' });
            setTimeout(() => router.push('/user/dashboard'), 2000);
        } catch (error: any) {
            setStatus({ type: 'error', message: 'Submission failed.' });
        }
    }

    return (
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                <div className="max-w-5xl mx-auto w-full">
                    
                    {/* Header matching your new style */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setSidebarOpen(true)} 
                                className="p-2.5 bg-white rounded-[18px] border-2 border-[#B8E3E9] shadow-[0_4px_12px_rgba(184,227,233,0.2)] hover:bg-[#B8E3E9]/10 transition-all duration-300 active:scale-95 flex items-center justify-center group lg:hidden"
                            >
                                <Icon name="menu" className="text-[#4F7C82] group-hover:scale-110 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-[#0B2E33] tracking-tighter">Raise Complaint.</h1>
                                <p className="text-[#4F7C82]/60 text-sm font-bold uppercase tracking-widest mt-1">Direct line to management</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-[#B8E3E9]/30 shadow-sm">
                           <div className="w-2.5 h-2.5 rounded-full bg-[#4F7C82] animate-pulse" />
                           <span className="text-[10px] font-black text-[#0B2E33] uppercase tracking-[0.2em]">{fullUser?.roomId?.roomNumber ? `Residence ${fullUser.roomId.roomNumber}` : 'Unassigned'}</span>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8E3E9]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                
                                {/* Heading Input */}
                                <div className="group space-y-4 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 group-focus-within:opacity-100 transition-opacity">Issue Subject</label>
                                    <input 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleChange}
                                        placeholder="What seems to be the trouble?" 
                                        className="w-full text-2xl font-black bg-transparent border-b-[3px] border-[#B8E3E9]/20 focus:border-[#4F7C82] outline-none pb-6 transition-all placeholder:text-[#B8E3E9] text-[#0B2E33]"
                                    />
                                </div>

                                {/* Details Area */}
                                <div className="group space-y-4 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 group-focus-within:opacity-100 transition-opacity">Detailed Narrative</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Help us understand the situation better..." 
                                        className="w-full text-lg font-medium bg-transparent border-b-[3px] border-[#B8E3E9]/20 focus:border-[#4F7C82] outline-none pb-6 transition-all resize-none placeholder:text-[#B8E3E9] text-[#4F7C82]"
                                    />
                                </div>

                                {/* Evidence Attachment */}
                                <div className="pt-4 relative z-10">
                                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-[#F8FAFC] border-2 border-dashed border-[#B8E3E9] hover:border-[#4F7C82] hover:bg-[#B8E3E9]/10 transition-all group/upload"
                                    >
                                        <div className="size-10 rounded-xl bg-white flex items-center justify-center text-[#4F7C82] shadow-sm group-hover/upload:scale-110 transition-transform">
                                            <Icon name="add_a_photo" className="text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0B2E33]">
                                                {formData.images.length > 0 ? `${formData.images.length} Captures Attached` : "Visual Evidence"}
                                            </p>
                                            <p className="text-[10px] font-bold text-[#4F7C82]/60 uppercase tracking-tighter">Optional but helpful</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-10">
                                
                                <div className="space-y-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82]/60 ml-1">Classification</label>
                                        <div className="relative">
                                            <select 
                                                name="category" 
                                                value={formData.category} 
                                                onChange={handleChange}
                                                className="w-full bg-[#F8FAFC] border border-[#B8E3E9]/30 p-5 rounded-2xl font-black text-[#0B2E33] outline-none appearance-none cursor-pointer focus:ring-[6px] focus:ring-[#B8E3E9]/20 text-[11px] uppercase tracking-widest transition-all"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Wifi">Internet Access</option>
                                                <option value="Plumbing">Plumbing</option>
                                                <option value="Cleaning">Sanitation</option>
                                                <option value="Electrical">Electrical</option>
                                            </select>
                                            <Icon name="expand_more" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4F7C82] pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82]/60 ml-1">Urgency Level</label>
                                        <div className="relative">
                                            <select 
                                                name="priority" 
                                                value={formData.priority} 
                                                onChange={handleChange}
                                                className="w-full bg-[#F8FAFC] border border-[#B8E3E9]/30 p-5 rounded-2xl font-black text-[#0B2E33] outline-none appearance-none cursor-pointer focus:ring-[6px] focus:ring-[#B8E3E9]/20 text-[11px] uppercase tracking-widest transition-all"
                                            >
                                                <option value="Normal">Routine(48h)</option>
                                                <option value="High">Priority (24h)</option>
                                                <option value="Urgent">Critical (Immediate)</option>
                                            </select>
                                            <Icon name="priority_high" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4F7C82] pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={submitComplaintMutation.isPending}
                                    className="w-full bg-[#4F7C82] hover:bg-[#0B2E33] text-white font-black py-6 rounded-2xl shadow-2xl shadow-[#4F7C82]/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
                                >
                                    {submitComplaintMutation.isPending ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Icon name="send" className="text-lg" />
                                    )}
                                    Dispatch Ticket
                                </button>
                            </div>

                            {/* Status Notification */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-6 rounded-[2rem] text-[10px] font-black tracking-[0.25em] text-center border shadow-sm ${status.type === 'success' ? 'bg-[#B8E3E9]/30 border-[#B8E3E9]/50 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
                                    >
                                        {status.message.toUpperCase()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}