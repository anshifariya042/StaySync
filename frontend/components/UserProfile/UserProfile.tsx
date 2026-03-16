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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-[#ec5b13] border-t-transparent animate-spin rounded-full"></div>
                    <p className="font-bold text-slate-500">Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#F9FAFB] font-display text-slate-900 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-4xl mx-auto w-full">
                        
                        <header className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="lg:hidden">
                                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                                        <Icon name="menu" className="text-[#ec5b13]" />
                                    </button>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
                            </div>
                            
                            {!isEditing && (
                                <button 
                                    onClick={handleEditToggle}
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-[#ec5b13] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all"
                                >
                                    <Icon name="edit" className="text-lg" />
                                    Edit
                                </button>
                            )}
                        </header>

                        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec5b13]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                                    <div className="size-32 rounded-[2.5rem] bg-[#ec5b13]/10 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group relative">
                                        {profile?.profileImage ? (
                                            <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <Icon name="person" className="text-5xl text-[#ec5b13]" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Icon name="photo_camera" className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-2xl font-black text-slate-900">{profile?.name}</h2>
                                        <p className="text-[#ec5b13] font-bold uppercase tracking-widest text-[10px] bg-[#ec5b13]/5 px-3 py-1 rounded-full inline-block mt-2">
                                            StaySync {profile?.role?.toUpperCase() || 'RESIDENT'}
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                            <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 flex items-center gap-2">
                                                <Icon name="domain" className="text-[14px]" />
                                                {profile?.hostelId?.name || 'Assigned hostel name'}
                                            </span>
                                            <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 flex items-center gap-2">
                                                <Icon name="meeting_room" className="text-[14px]" />
                                                Room {profile?.roomId?.roomNumber || 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {message.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 ${
                                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}
                                    >
                                        <Icon name={message.type === 'success' ? 'check_circle' : 'error'} />
                                        {message.text}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                            <div className={`relative group ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="person" className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#ec5b13]' : 'text-slate-300'}`} />
                                                <input 
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ec5b13] focus:ring-4 focus:ring-[#ec5b13]/5 transition-all outline-none font-bold text-slate-700 disabled:cursor-not-allowed"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                            <div className={`relative group ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="mail" className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#ec5b13]' : 'text-slate-300'}`} />
                                                <input 
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ec5b13] focus:ring-4 focus:ring-[#ec5b13]/5 transition-all outline-none font-bold text-slate-700 disabled:cursor-not-allowed"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                            <div className={`relative group ${!isEditing ? 'opacity-70' : ''}`}>
                                                <Icon name="call" className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#ec5b13]' : 'text-slate-300'}`} />
                                                <input 
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    readOnly={!isEditing}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ec5b13] focus:ring-4 focus:ring-[#ec5b13]/5 transition-all outline-none font-bold text-slate-700 disabled:cursor-not-allowed"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Role</label>
                                            <div className="relative group opacity-60">
                                                <Icon name="verified_user" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input 
                                                    type="text"
                                                    value={(profile?.role || 'user').toUpperCase()}
                                                    readOnly
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-100 transition-all outline-none font-bold text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                                            <button 
                                                type="submit"
                                                disabled={updateProfileMutation.isPending}
                                                className="flex-1 md:flex-none px-12 py-4 bg-[#ec5b13] text-white rounded-2xl font-black shadow-lg shadow-[#ec5b13]/20 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
                                            >
                                                {updateProfileMutation.isPending ? (
                                                    <div className="size-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                                ) : (
                                                    <Icon name="save" className="text-sm font-bold" />
                                                )}
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={handleEditToggle}
                                                className="flex-1 md:flex-none px-12 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                            >
                                                Cancel
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
