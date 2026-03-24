"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useUpdateProfile } from '@/hooks/useUser';

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function StaffProfile() {
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore();
    const { setIsOpen } = useSidebarStore();
    const updateProfileMutation = useUpdateProfile();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!profile && !isProfileLoading) {
            fetchProfile();
        }
    }, [profile, isProfileLoading, fetchProfile]);

    useEffect(() => {
        if (profile && !isEditing) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            });
        }
    }, [profile, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        try {
            await updateProfileMutation.mutateAsync(formData);
            setMessage({ type: 'success', text: 'Identity logs updated successfully.' });
            setIsEditing(false);
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Update failed.' 
            });
        }
    };

    if (!profile && isProfileLoading) {
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

            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#B8E3E9]/20 bg-[#F8FAFC]/80 backdrop-blur-md px-6 md:px-10 py-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="lg:hidden size-12 flex items-center justify-center bg-white border border-[#B8E3E9] rounded-2xl text-[#4F7C82] hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                    >
                        <Icon name="menu" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#0B2E33] tracking-tighter">Profile Configuration</h1>
                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] opacity-60 mt-0.5">Identify & Authentication Logs</p>
                    </div>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-4 bg-[#0B2E33] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0B2E33]/20 hover:scale-105 transition-all outline-none"
                    >
                        Edit Matrix
                    </button>
                )}
            </header>

            <main className="p-4 md:p-10 max-w-4xl mx-auto space-y-12">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-10 md:p-16 relative overflow-hidden group">
                    {/* Decor */}
                    <div className="absolute -right-20 -top-20 size-64 bg-[#B8E3E9]/10 rounded-full blur-[100px] group-hover:bg-[#B8E3E9]/20 transition-all duration-1000"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
                            <div className="size-40 rounded-[3rem] bg-[#B8E3E9]/20 flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden group/avatar hover:scale-105 transition-all duration-500">
                                {profile?.profileImage ? (
                                    <img src={profile.profileImage} className="size-full object-cover" alt="Profile" />
                                ) : (
                                    <Icon name="person" className="text-6xl text-[#4F7C82]" />
                                )}
                                <div className="absolute inset-0 bg-[#0B2E33]/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Icon name="photo_camera" className="text-white text-3xl" />
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-4xl font-black text-[#0B2E33] tracking-tighter leading-none">{profile?.name}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                                    <span className="px-6 py-2 bg-[#4F7C82] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-[#4F7C82]/20">
                                        <Icon name="verified_user" className="text-sm" />
                                        {profile?.role} PORTAL
                                    </span>
                                    <span className="px-6 py-2 bg-white text-[#4F7C82] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#B8E3E9]/30">
                                        <Icon name="corporate_fare" className="text-sm" />
                                        {profile?.hostelId?.name || "Operations Center"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 rounded-2xl mb-12 text-xs font-black uppercase tracking-widest flex items-center gap-4 ${
                                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-white' : 'bg-red-50 text-red-700 border border-white'
                                } shadow-sm`}
                            >
                                <Icon name={message.type === 'success' ? 'check_circle' : 'error'} className="text-xl" />
                                {message.text}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] ml-1 opacity-60">Full Identity</label>
                                <div className="relative group">
                                    <Icon name="badge" className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#0B2E33]' : 'text-[#4F7C82] opacity-40'}`} />
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-slate-100 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-4 focus:ring-[#B8E3E9]/50 transition-all outline-none font-black text-[#0B2E33] placeholder:opacity-30 disabled:opacity-60"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] ml-1 opacity-60">Communication Logs</label>
                                <div className="relative group">
                                    <Icon name="mail" className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#0B2E33]' : 'text-[#4F7C82] opacity-40'}`} />
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-slate-100 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-4 focus:ring-[#B8E3E9]/50 transition-all outline-none font-black text-[#0B2E33] placeholder:opacity-30 disabled:opacity-60"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] ml-1 opacity-60">Mobile Frequency</label>
                                <div className="relative group">
                                    <Icon name="call" className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#0B2E33]' : 'text-[#4F7C82] opacity-40'}`} />
                                    <input 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-slate-100 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-4 focus:ring-[#B8E3E9]/50 transition-all outline-none font-black text-[#0B2E33] placeholder:opacity-30 disabled:opacity-60"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] ml-1 opacity-60">Node Identification</label>
                                <div className="relative group opacity-60">
                                    <Icon name="fingerprint" className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4F7C82] opacity-40" />
                                    <input 
                                        type="text"
                                        value={profile?._id?.slice(-8).toUpperCase() || "STF-XXXXXX"}
                                        disabled
                                        className="w-full pl-16 pr-6 py-5 rounded-3xl border border-slate-100 bg-[#F8FAFC] transition-all outline-none font-black text-[#4F7C82] cursor-not-allowed uppercase tracking-widest"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="md:col-span-2 flex gap-6 pt-10 border-t border-slate-50">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-[#0B2E33] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-[#0B2E33]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <Icon name="save" className="text-lg" />
                                        Secure Identity
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-10 py-5 bg-[#B8E3E9]/30 text-[#4F7C82] rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#B8E3E9]/50 transition-all active:scale-95"
                                    >
                                        Discard Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
