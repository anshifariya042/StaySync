"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import NotificationDropdown from '@/components/ui/NotificationDropdown'
import { useUserStore } from '@/store/useUserStore'
import api from '@/lib/api'

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function PreviousHostels() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-[#4F7C82]">Loading...</div>}>
            <PreviousHostelsContent />
        </Suspense>
    );
}

function PreviousHostelsContent() {
    const router = useRouter()
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!profile && !isProfileLoading) {
            fetchProfile()
        }
    }, [profile, isProfileLoading, fetchProfile])

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/my-bookings');
                
                // Filter to show previous stays (completed, cancelled, rejected)
                // Or simply all bookings that are not currently active
                const pastBookings = response.data.filter((b: any) => 
                    b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected' || 
                    (b.status === 'approved' && profile?.hostelId?._id !== b.hostelId?._id) // Or if they moved to a different hostel
                );
                
                // If the backend doesn't explicitly mark "completed", we just fall back to all bookings for now, 
                // but let's prioritize showing all bookings so the user actually sees their data
                setBookings(response.data); 
            } catch (error) {
                console.error("Failed to fetch past bookings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, [profile]);

    return (
        <div className="bg-[#f6f6f6] font-['Inter'] text-[#2d2f2f] min-h-screen antialiased">
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
                    <header className="sticky top-0 w-full z-50 bg-[#f6f6f6]/80 backdrop-blur-md flex items-center justify-between px-6 h-20 mb-8 border-b border-[#acadad]/20 lg:hidden">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setSidebarOpen(true)} 
                                className="p-2.5 bg-white rounded-[18px] border-2 border-[#B8E3E9] shadow-[0_4px_12px_rgba(184,227,233,0.2)] hover:bg-[#B8E3E9]/10 transition-all duration-300 active:scale-95 flex items-center justify-center group"
                            >
                                <Icon name="menu" className="text-[#4F7C82] group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#053930]">Previous Hostels</h1>
                        </div>
                        {/* <button className="text-[#b1202d] transition-all duration-300 ease-in-out scale-95 active:scale-90">
                            <Icon name="tune" />
                        </button> */}
                    </header>

                    <div className="px-6 md:px-10 py-8 lg:py-12 max-w-5xl mx-auto w-full">
                        <header className="hidden lg:flex items-center justify-between mb-12">
                            <div>
                                <h1 className="text-3xl font-black text-[#03090a] tracking-tighter">
                                    Previous Hostels
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <div
                                    onClick={() => router.push('/user/profile')}
                                    className="size-14 rounded-2xl border-4 border-white shadow-xl bg-slate-100 bg-center bg-cover overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                                    style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}>
                                    {!profile?.profileImage && (
                                        <div className="size-full flex items-center justify-center text-[#4F7C82] font-black bg-white">
                                            {profile?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        <section className="mb-12">
                            <p className="text-[#00675f] font-medium tracking-widest uppercase text-xs mb-2">Your Past STAY</p>
                            {/* <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight text-[#2d2f2f] mb-3">Your past stays and experiences</h2>
                            <div className="w-12 h-1 bg-[#b1202d] rounded-full"></div> */}
                        </section>


                        {isLoading ? (
                            <div className="flex items-center justify-center py-20 text-[#00675f] font-bold">
                                Loading your history...
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-24 h-24 bg-[#e7e8e8] rounded-full flex items-center justify-center mb-6">
                                    <Icon name="sentiment_dissatisfied" className="text-5xl text-[#5a5c5c]" />
                                </div>
                                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-2">No previous bookings yet</h3>
                                <p className="text-[#5a5c5c] max-w-xs mx-auto mb-8">Adventure is calling! Start your journey by booking your first hostel stay.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {bookings.map((booking, index) => {
                                    const hostel = booking.hostelId;
                                    if (!hostel) return null;

                                    const joinDate = new Date(booking.moveInDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                                    
                                    // If status is cancelled or completed, updatedAt is basically when they vacated.
                                    const vacateDateObj = (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'rejected') ? new Date(booking.updatedAt) : null;
                                    const vacateDate = vacateDateObj ? vacateDateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Present';
                                    
                                    const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';

                                    return (
                                        <motion.article 
                                            key={booking._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(45,47,47,0.06)] transition-transform duration-300 hover:scale-[1.02] flex flex-col"
                                        >
                                            <div className="relative h-64 overflow-hidden group">
                                                <img 
                                                    alt={hostel.name} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    src={hostel.images && hostel.images.length > 0 ? hostel.images[0] : 'https://placehold.co/600x400?text=Hostel'} 
                                                />
                                                <div className={`absolute top-4 left-4 ${isCancelled ? 'bg-[#f95630]/90' : 'bg-[#00675f]/90'} text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm`}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#2d2f2f]">{hostel.name}</h3>
                                                </div>
                                                <div className="space-y-2 mb-6">
                                                    <p className="flex items-center gap-2 text-[#5a5c5c] text-sm">
                                                        <Icon name="location_on" className="text-[18px]" />
                                                        {hostel.location || 'Location missing'}
                                                    </p>
                                                    <p className="flex items-center gap-2 text-[#5a5c5c] text-sm">
                                                        <Icon name="login" className="text-[18px]" />
                                                        Joined: {joinDate}
                                                    </p>
                                                    <p className="flex items-center gap-2 text-[#5a5c5c] text-sm">
                                                        <Icon name="logout" className="text-[18px]" />
                                                        Vacated: <span className="font-semibold">{vacateDate}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <div className="lg:hidden h-24"></div>
        </div>
    )
}
