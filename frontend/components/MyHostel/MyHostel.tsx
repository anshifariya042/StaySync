"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useUserStore } from '@/store/useUserStore'
import api from '@/lib/api'
import RestrictedAccess from '@/components/ui/RestrictedAccess'
import NotificationDropdown from '@/components/ui/NotificationDropdown'
import { useModal } from '@/components/Providers/ModalProvider'

// Helper for Material Symbols
const Icon = ({ name, className = "", fill = false }: { name: string, className?: string, fill?: boolean }) => (
    <span className={`material-symbols-outlined ${className} ${fill ? 'font-fill' : ''}`}>{name}</span>
)

export default function MyHostel() {
    const router = useRouter()
    const { logout } = useAuth()
    const { profile, isLoading, fetchProfile } = useUserStore()
    const { showAlert } = useModal()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [reviews, setReviews] = useState<any[]>([])
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)

    useEffect(() => {
        if (!profile) {
            fetchProfile()
        }
    }, [profile, fetchProfile])

    useEffect(() => {
        const fetchReviews = async () => {
            if (profile?.hostelId?._id) {
                try {
                    const res = await api.get(`/reviews/hostel/${profile.hostelId._id}`)
                    // Filter to only show the logged in user's review
                    const userReview = res.data?.filter((rev: any) => 
                        (rev.userId?._id || rev.userId) === profile._id
                    ) || []
                    setReviews(userReview)
                } catch (error) {
                    console.error("Failed to fetch reviews:", error)
                }
            }
        }
        fetchReviews()
    }, [profile?.hostelId?._id, profile?._id])

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile?.hostelId?._id || !newComment || submittingReview) return

        setSubmittingReview(true)
        try {
            await api.post('/reviews', {
                hostelId: profile.hostelId._id,
                rating: newRating,
                comment: newComment
            })

            // Refresh reviews and profile to get updated rating
            const [reviewsRes] = await Promise.all([
                api.get(`/reviews/hostel/${profile.hostelId._id}`),
                fetchProfile()
            ])
            const userReview = reviewsRes.data?.filter((rev: any) => 
                (rev.userId?._id || rev.userId) === profile._id
            ) || []
            setReviews(userReview)

            // Reset form
            setShowReviewForm(false)
            setNewRating(5)
            setNewComment('')
            showAlert("Review Status", "Feedback successfully cataloged in the system registry.", "success")
        } catch (error: any) {
            console.error("Failed to submit review:", error)
            showAlert("Submission Error", error.response?.data?.message || "Failed to submit review to the server.", "error")
        } finally {
            setSubmittingReview(false)
        }
    }

    const hostel = profile?.hostelId;
    const room = profile?.roomId;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <div className="size-12 border-4 border-[#4F7C82]/20 border-t-[#4F7C82] rounded-full animate-spin"></div>
                <p className="mt-6 text-[#4F7C82] font-black text-[10px] uppercase tracking-[0.2em] opacity-60">Synchronizing Data...</p>
            </div>
        )
    }

    if (profile?.status === 'pending' || profile?.status === 'rejected') {
        return <RestrictedAccess status={profile.status as string} name={profile.name} />;
    }

    return (
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased">
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-5xl mx-auto w-full">
                        
                        <header className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSidebarOpen(true)} 
                                    className="p-2.5 bg-white rounded-[18px] border-2 border-[#B8E3E9] shadow-[0_4px_12px_rgba(184,227,233,0.2)] hover:bg-[#B8E3E9]/10 transition-all duration-300 active:scale-95 flex items-center justify-center group lg:hidden"
                                >
                                    <Icon name="menu" className="text-[#4F7C82] group-hover:scale-110 transition-transform" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-black text-[#0B2E33] tracking-tighter">My Hostel</h1>
                                    <p className="text-[#4F7C82] text-xs font-black uppercase tracking-widest mt-1 opacity-70">Manage your stay & residency</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <div 
                                     onClick={() => router.push('/user/profile')}
                                     className="size-14 rounded-2xl border-4 border-white shadow-xl bg-slate-100 bg-center bg-cover overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300" 
                                     style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}>
                                    {!profile?.profileImage && (
                                        <div className="w-full h-full flex items-center justify-center bg-[#B8E3E9] text-[#0B2E33] font-black text-xl">
                                            {profile?.name?.charAt(0) || <Icon name="person" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        {!hostel ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-20 rounded-[3rem] text-center border border-slate-50 shadow-sm relative overflow-hidden">
                                <div className="size-28 bg-[#B8E3E9]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Icon name="apartment" className="text-6xl text-[#4F7C82]/30" />
                                </div>
                                <h3 className="text-3xl font-black text-[#0B2E33] mb-3 tracking-tight">No Hostel Assigned</h3>
                                <p className="text-[#4F7C82] max-w-sm mx-auto mb-10 font-bold tracking-tight opacity-70">Your profile is currently awaiting a residence allocation from the administrative department.</p>
                                <button onClick={() => router.push('/explore-hostels')} className="bg-[#4F7C82] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0B2E33] transition-all shadow-xl shadow-[#4F7C82]/20 active:scale-95">
                                    Explore Hostels
                                </button>
                                {/* Decorative circle */}
                                <div className="absolute -right-10 -bottom-10 size-40 bg-[#B8E3E9]/10 rounded-full blur-3xl"></div>
                            </motion.div>
                        ) : (
                            <div className="space-y-10">
                                {/* Hero Banner */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group relative h-[400px] w-full overflow-hidden rounded-[3.5rem] shadow-2xl shadow-[#4F7C82]/10 border-4 border-white">
                                    <img src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d1502f?q=80&w=1200'} className="size-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Hostel" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E33]/90 via-[#0B2E33]/30 to-transparent"></div>
                                    <div className="absolute bottom-12 left-12">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-[#B8E3E9] text-[#0B2E33] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Verified Residence</span>
                                        </div>
                                        <h2 className="text-6xl font-black text-white tracking-tighter mb-2">{hostel.name}</h2>
                                        <p className="flex items-center gap-2 text-white/80 font-bold tracking-wide uppercase text-xs">
                                            <Icon name="location_on" className="text-lg text-[#B8E3E9]" />
                                            {hostel.location}
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-10">
                                        {/* Facilities */}
                                        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="text-2xl font-black text-[#0B2E33] tracking-tight">Included Facilities</h3>
                                                <div className="size-8 bg-[#B8E3E9]/40 rounded-lg flex items-center justify-center">
                                                    <Icon name="apps" className="text-[#4F7C82] text-lg" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                                {(hostel.facilities?.length > 0 ? hostel.facilities : ['WiFi', 'Laundry', 'Mess', 'CCTV']).map((fac: string, idx: number) => (
                                                    <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-[#F8FAFC] border border-[#B8E3E9]/10 hover:border-[#4F7C82]/30 hover:bg-white hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500 group">
                                                        <div className="size-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-[#4F7C82] transition-all duration-500">
                                                            <Icon name={
                                                                fac.toLowerCase().includes('wifi') ? 'wifi' : 
                                                                fac.toLowerCase().includes('laundry') ? 'local_laundry_service' : 
                                                                fac.toLowerCase().includes('cctv') ? 'videocam' : 
                                                                fac.toLowerCase().includes('gym') ? 'fitness_center' : 
                                                                fac.toLowerCase().includes('ac') || fac.toLowerCase().includes('air conditioning') ? 'ac_unit' : 
                                                                'restaurant'
                                                            } className="text-[#4F7C82] group-hover:text-white transition-colors duration-500" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100">{fac}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* decorative circle */}
                                            <div className="absolute -left-10 -top-10 size-40 bg-[#B8E3E9]/5 rounded-full blur-3xl"></div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between px-2">
                                                <h3 className="text-2xl font-black text-[#0B2E33] tracking-tight">Your Feedback</h3>
                                                {reviews.length === 0 && (
                                                    <button 
                                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                                        className="text-[#4F7C82] text-xs font-black uppercase tracking-[0.2em] hover:text-[#0B2E33] transition-colors"
                                                    >
                                                        {showReviewForm ? 'DISCARD FORM' : 'SUBMIT REVIEW'}
                                                    </button>
                                                )}
                                            </div>

                                            {showReviewForm && (
                                                <motion.form 
                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onSubmit={handleSubmitReview} 
                                                    className="bg-white p-8 rounded-[3rem] border border-[#B8E3E9]/30 shadow-xl shadow-[#4F7C82]/5 space-y-6 relative overflow-hidden"
                                                >
                                                    <div>
                                                        <h4 className="font-black text-[#0B2E33] text-lg tracking-tight">Share your experience</h4>
                                                        <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-widest mt-1 opacity-60">Help others choose their stay</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setNewRating(star)}
                                                                className="focus:outline-none transition-all hover:scale-125 hover:-translate-y-1 active:scale-95"
                                                            >
                                                                <Icon 
                                                                    name="star" 
                                                                    className={`text-3xl ${star <= newRating ? 'text-[#4F7C82]' : 'text-[#B8E3E9]'}`}
                                                                    fill={star <= newRating}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Draft your residency insights here..."
                                                        className="w-full p-6 rounded-[2rem] bg-[#F8FAFC] border border-[#B8E3E9]/40 focus:ring-4 focus:ring-[#B8E3E9]/20 focus:border-[#4F7C82] outline-none min-h-[140px] text-sm font-bold text-[#0B2E33] transition-all placeholder:text-[#4F7C82]/40"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={submittingReview}
                                                        className="w-full py-5 bg-[#4F7C82] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl disabled:opacity-50 shadow-xl shadow-[#4F7C82]/20 hover:bg-[#0B2E33] hover:shadow-none transition-all duration-300"
                                                    >
                                                        {submittingReview ? 'Processing...' : 'Confirm Submission'}
                                                    </button>
                                                </motion.form>
                                            )}
                                            
                                            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
                                                {/* Rating Summary Card */}
                                                <div className="min-w-[220px] bg-[#0B2E33] text-white p-8 rounded-[3rem] flex flex-col justify-center items-center shadow-2xl shadow-[#0B2E33]/10 relative group overflow-hidden">
                                                    <span className="text-6xl font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500">{profile?.hostelId?.averageRating || "0.0"}</span>
                                                    <div className="flex gap-1 my-3 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Icon 
                                                                key={s} 
                                                                name={s <= Math.round(profile?.hostelId?.averageRating || 0) ? "star" : (s - 0.5 <= (profile?.hostelId?.averageRating || 0) ? "star_half" : "star")} 
                                                                className="text-xs text-[#B8E3E9]" 
                                                                fill={s <= Math.round(profile?.hostelId?.averageRating || 0)} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{profile?.hostelId?.numberOfReviews || 0} TOTAL REVIEWS</p>
                                                    {/* decoration */}
                                                    <div className="absolute -right-4 -top-4 size-20 bg-[#B8E3E9]/10 rounded-full blur-2xl"></div>
                                                </div>

                                                {/* Review Cards */}
                                                {reviews.length > 0 ? (
                                                    reviews.map((rev) => (
                                                        <div key={rev._id} className="min-w-[320px] bg-white p-8 rounded-[3rem] border border-[#B8E3E9]/30 shadow-lg shadow-[#4F7C82]/5 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div>
                                                                    <p className="text-[10px] font-black text-[#4F7C82] mb-1 uppercase tracking-widest">Your Account Review</p>
                                                                    <p className="text-[10px] text-[#0B2E33]/40 font-black uppercase tracking-tight">{new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 bg-[#B8E3E9]/20 px-3 py-1.5 rounded-xl border border-[#B8E3E9]/40 shadow-sm">
                                                                    <span className="text-sm font-black text-[#4F7C82]">{rev.rating}</span>
                                                                    <Icon name="star" className="text-[10px] text-[#4F7C82]" fill={true} />
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-[#0B2E33] leading-relaxed font-bold italic opacity-80">"{rev.comment}"</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="min-w-[320px] bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                                                        <Icon name="rate_review" className="text-5xl mb-4 text-[#B8E3E9]/40" />
                                                        <p className="text-xs font-black text-[#4F7C82] uppercase tracking-[0.2em] mb-2">No feedback cataloged</p>
                                                        <p className="text-[10px] text-[#0B2E33]/30 font-bold uppercase tracking-widest max-w-[180px]">Draft your residency experience for the directory</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Sidebar: Room Details */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-10">
                                                    <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] opacity-60">Inventory ID</p>
                                                    <span className="bg-[#B8E3E9]/30 text-[#4F7C82] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                        {profile?.status || 'Occupied'}
                                                    </span>
                                                </div>
                                                <div className="mb-10 text-center">
                                                    <h4 className="text-8xl font-black text-[#0B2E33] tracking-tighter mb-2 scale-110 transform transition-transform group-hover:scale-125 duration-700">{room?.roomNumber || 'TBD'}</h4>
                                                    <p className="text-[#4F7C82] font-black uppercase text-[11px] tracking-[0.3em] inline-block px-4 py-1.5 bg-[#B8E3E9]/10 rounded-xl mt-4 border border-[#B8E3E9]/20">{profile?.roomType || room?.type || 'Standard Suite'}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-8 border-t border-slate-50 mb-10">
                                                    <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest opacity-60">Monthly Tariff</span>
                                                    <span className="text-3xl font-black text-[#0B2E33] tracking-tight">₹{room?.price || hostel?.price || '0.00'}</span>
                                                </div>
                                                <button onClick={() => router.push('/user/complaints/new')} className="w-full bg-[#0B2E33] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-[#4F7C82] transition-all shadow-2xl shadow-[#0B2E33]/20 active:scale-95 group/btn">
                                                    <Icon name="report" className="text-lg group-hover/btn:rotate-12 transition-transform" /> 
                                                    Ticket Maintenance
                                                </button>
                                            </div>
                                            {/* decorative circle */}
                                            <div className="absolute -right-16 -top-16 size-48 bg-[#B8E3E9]/10 rounded-full blur-3xl"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <div className="lg:hidden h-24"></div>
        </div>
    )
}