"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { useUpdateProfile } from '@/hooks/useUser';
import { User, Mail, Phone, ShieldCheck, MapPin, Building, Save, X, Camera, Menu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StaffProfile({ onMenuClick }: { onMenuClick?: () => void }) {
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore();
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
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 min-h-screen">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="p-2 text-slate-500 hover:text-blue-600 md:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </header>

            <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl relative group">
                                {profile?.profileImage ? (
                                    <img src={profile.profileImage} className="w-full h-full object-cover rounded-[2 rem]" alt="Profile" />
                                ) : (
                                    <User className="w-12 h-12 text-blue-600" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-[2 rem]">
                                    <Camera className="text-white w-6 h-6" />
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{profile?.name}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                                    <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {profile?.role} PORTAL
                                    </span>
                                    <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-bold flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                                        <Building className="w-3.5 h-3.5" />
                                        {profile?.hostelId?.name || "Assigned Hostel"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 ${
                                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-slate-700 dark:text-white disabled:opacity-60"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-slate-700 dark:text-white disabled:opacity-60"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
                                    <input 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-slate-700 dark:text-white disabled:opacity-60"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work ID</label>
                                <div className="relative group opacity-60">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input 
                                        type="text"
                                        value={profile?._id?.slice(-8).toUpperCase() || "STF-XXXXXX"}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 transition-all outline-none font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="md:col-span-2 flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-3"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
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
