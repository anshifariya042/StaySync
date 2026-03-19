"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/useUserStore'
import { useUpdateProfile } from '@/hooks/useUser'
import UserSidebar from '@/components/UserSidebar/UserSidebar'

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function UserProfile() {
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
    const updateProfileMutation = useUpdateProfile()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    // Initial fetch if needed
    useEffect(() => {
        if (!profile && !isProfileLoading) {
            fetchProfile()
        }
    }, [profile, isProfileLoading, fetchProfile])

    // Sync formData with profile but ONLY when not editing
    useEffect(() => {
        if (profile && !isEditing) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            })
        }
    }, [profile, isEditing])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submitting form data:", formData)
        setMessage({ type: '', text: '' })
        
        try {
            const result = await updateProfileMutation.mutateAsync(formData)
            console.log("Update success:", result)
            setMessage({ type: 'success', text: 'Profile details updated successfully!' })
            setIsEditing(false)
        } catch (error: any) {
            console.error("Update failed:", error)
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Update failed. Please try again.' 
            })
        }
    }

    const handleEditToggle = () => {
        console.log("Toggling edit mode. Current isEditing:", isEditing)
        setIsEditing(!isEditing)
        if (isEditing) {
            // Reset to profile if canceling
            setFormData({
                name: profile?.name || '',
                email: profile?.email || '',
                phone: profile?.phone || ''
            })
        }
    }

    if (!profile && isProfileLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="size-12 border-4 border-[#4F7C82]/20 border-t-[#4F7C82] animate-spin rounded-full shadow-lg"></div>
                    <p className="font-black text-[#4F7C82] text-[10px] uppercase tracking-[0.2em] opacity-60">Synchronizing Identity...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-4xl mx-auto w-full">
                        
                        <header className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="lg:hidden">
                                    <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-white rounded-2xl shadow-sm border border-[#B8E3E9]">
                                        <Icon name="menu" className="text-[#4F7C82]" />
                                    </button>
                                </div>
                                <h1 className="text-3xl font-black text-[#0B2E33] tracking-tighter">My Profile</h1>
                            </div>
                            
                            {!isEditing && (
                                <button 
                                    onClick={handleEditToggle}
                                    className="px-8 py-3 bg-white border border-[#B8E3E9]/50 text-[#4F7C82] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#F8FAFC] shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    <Icon name="edit" className="text-lg" />
                                    Edit Details
                                </button>
                            )}
                        </header>

                        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-slate-50 overflow-hidden relative group">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8E3E9]/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
                                    <div className="size-40 rounded-[3rem] bg-[#B8E3E9]/20 flex items-center justify-center border-[6px] border-white shadow-2xl overflow-hidden group/avatar relative">
                                        {profile?.profileImage ? (
                                            <img src={profile.profileImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" alt="Profile" />
                                        ) : (
                                            <Icon name="person" className="text-6xl text-[#4F7C82]" />
                                        )}
                                        <div className="absolute inset-0 bg-[#0B2E33]/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                                            <Icon name="photo_camera" className="text-white text-3xl" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-4xl font-black text-[#0B2E33] tracking-tight">{profile?.name}</h2>
                                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                            <span className="px-5 py-2 bg-[#B8E3E9]/30 border border-[#B8E3E9]/50 rounded-full text-[10px] font-black tracking-widest text-[#4F7C82] uppercase flex items-center gap-2 shadow-sm">
                                                StaySync Resident
                                            </span>
                                            <span className="px-5 py-2 bg-[#F8FAFC] border border-[#B8E3E9]/20 rounded-full text-[10px] font-black tracking-widest text-[#4F7C82]/60 uppercase flex items-center gap-2">
                                                <Icon name="domain" className="text-[16px]" />
                                                {profile?.hostelId?.name || 'Allocation Pending'}
                                            </span>
                                            <span className="px-5 py-2 bg-[#F8FAFC] border border-[#B8E3E9]/20 rounded-full text-[10px] font-black tracking-widest text-[#4F7C82]/60 uppercase flex items-center gap-2">
                                                <Icon name="meeting_room" className="text-[16px]" />
                                                Room {profile?.roomId?.roomNumber || 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {message.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`p-5 rounded-[1.5rem] mb-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-sm border ${
                                            message.type === 'success' ? 'bg-[#B8E3E9]/30 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}
                                    >
                                        <div className={`p-1.5 rounded-lg ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white shadow-lg'}`}>
                                            <Icon name={message.type === 'success' ? 'check' : 'priority_high'} className="text-sm font-black" />
                                        </div>
                                        {message.text}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="group space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 group-focus-within:opacity-100 transition-opacity ml-1">Full Identity</label>
                                            <div className={`relative ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="person" className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#4F7C82]' : 'text-[#B8E3E9]'}`} />
                                                <input 
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-50 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-[6px] focus:ring-[#B8E3E9]/20 transition-all outline-none font-bold text-[#0B2E33] disabled:cursor-not-allowed shadow-inner"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="group space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 group-focus-within:opacity-100 transition-opacity ml-1">Digital Correspondence</label>
                                            <div className={`relative ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="mail" className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#4F7C82]' : 'text-[#B8E3E9]'}`} />
                                                <input 
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-50 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-[6px] focus:ring-[#B8E3E9]/20 transition-all outline-none font-bold text-[#0B2E33] disabled:cursor-not-allowed shadow-inner"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="group space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 group-focus-within:opacity-100 transition-opacity ml-1">Communication Line</label>
                                            <div className={`relative ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="call" className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#4F7C82]' : 'text-[#B8E3E9]'}`} />
                                                <input 
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-50 bg-[#F8FAFC] focus:bg-white focus:border-[#4F7C82] focus:ring-[6px] focus:ring-[#B8E3E9]/20 transition-all outline-none font-bold text-[#0B2E33] disabled:cursor-not-allowed shadow-inner"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>

                                        <div className="group space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F7C82] opacity-50 ml-1">System Privilege</label>
                                            <div className="relative opacity-60">
                                                <Icon name="verified_user" className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B8E3E9]" />
                                                <input 
                                                    type="text"
                                                    value={(profile?.role || 'user').toUpperCase()}
                                                    readOnly
                                                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-50 bg-[#F8FAFC] transition-all outline-none font-black text-[#4F7C82] cursor-not-allowed uppercase tracking-widest text-[11px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row gap-5">
                                            <button 
                                                type="submit"
                                                disabled={updateProfileMutation.isPending}
                                                className="flex-1 md:flex-none px-16 py-5 bg-[#4F7C82] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-[#4F7C82]/30 hover:bg-[#0B2E33] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-4"
                                            >
                                                {updateProfileMutation.isPending ? (
                                                    <div className="size-5 border-[3px] border-white/30 border-t-white animate-spin rounded-full"></div>
                                                ) : (
                                                    <Icon name="check_circle" className="text-lg" />
                                                )}
                                                Confirm Update
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={handleEditToggle}
                                                className="flex-1 md:flex-none px-16 py-5 bg-[#F8FAFC] text-[#4F7C82] border border-[#B8E3E9]/40 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-[#B8E3E9]/10 transition-all active:scale-95"
                                            >
                                                Discard Changes
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Nav spacer for mobile */}
            <div className="lg:hidden h-24"></div>
        </div>
    )
}
