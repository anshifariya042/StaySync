"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { useModal } from "@/components/Providers/ModalProvider";


interface Room {
    _id: string;
    roomNumber: string;
    type: string;
    capacity: number;
    price: number;
    status: string;
}

interface Hostel {
    _id: string;
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    totalRooms: number;
    facilities: string[];
    roomTypes: string[];
    images: string[];
    price: number;
    averageRating: number;
    numberOfReviews: number;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
}

interface Review {
    _id: string;
    userId: User;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function HostelDetails() {
    const { profile } = useUserStore();
    const { id } = useParams();
    const { showAlert } = useModal();

    const router = useRouter();
    const [hostel, setHostel] = useState<Hostel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [currentRoomPage, setCurrentRoomPage] = useState(1);
    const roomsPerPage = 2;

    const images = (hostel?.images && hostel.images.length > 0) 
        ? hostel.images 
        : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (id) {
                     const [hostelRes, roomsRes, reviewsRes] = await Promise.all([
                        api.get(`/hostels/${id}`),
                        api.get(`/hostels/${id}/rooms`),
                        api.get(`/reviews/hostel/${id}`)
                    ]);
                    setHostel(hostelRes.data.hostel);
                    const fetchedRooms = roomsRes.data || [];
                    setRooms(fetchedRooms);
                    setReviews(reviewsRes.data || []);
                    // if (fetchedRooms.length > 0) {
                    //     setSelectedRoom(fetchedRooms[0]);
                    // }
                }
            } catch (error) {
                console.error("Failed to fetch hostel details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f6f6f8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f6f8] text-slate-600">
                <span className="material-symbols-outlined text-6xl mb-4">error_outline</span>
                <h2 className="text-2xl font-bold text-slate-900">Hostel Not Found</h2>
                <p className="mt-2 text-slate-500 text-center">We couldn't locate the details for this hostel. It may have been removed or no longer exists.</p>
                <button
                    onClick={() => router.push('/explore-hostels')}
                    className="mt-6 px-6 py-3 bg-[#5048e5] text-white font-bold rounded-xl"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    const formatRoomType = (type: string) => {
        if (!type) return "Standard Unit";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const indexOfLastRoom = currentRoomPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const totalPages = Math.ceil(rooms.length / roomsPerPage);

    return (
        <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Content Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Section / Multi-Image Gallery */}
                        <section className="space-y-4">
                            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-slate-200 border border-slate-100 shadow-xl shadow-slate-200/50 group">
                                <img
                                    src={images[currentImageIndex]}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    alt={hostel.name}
                                />
                                {images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 size-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 border border-white/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-95 shadow-lg"
                                        >
                                            <span className="material-symbols-outlined font-black">arrow_back_ios</span>
                                        </button>
                                        <button 
                                            onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 size-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 border border-white/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-95 shadow-lg"
                                        >
                                            <span className="material-symbols-outlined font-black">arrow_forward_ios</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Thumbnails Grid */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                                    {images.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-primary ring-4 ring-primary/10' : 'border-white opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-between gap-4 mt-8">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{hostel.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">{hostel.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5 text-amber-500">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <span 
                                                        key={s} 
                                                        className="material-symbols-outlined text-lg" 
                                                        style={s <= Math.round(hostel.averageRating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                    >
                                                        {s <= Math.round(hostel.averageRating) ? 'star' : (s - 0.5 <= hostel.averageRating ? 'star_half' : 'star')}
                                                    </span>
                                                ))}
                                            </div>
                                            {/* <span className="text-sm font-bold text-slate-900">{hostel.averageRating || "New"}</span>
                                            <span className="text-sm font-medium text-slate-400">({hostel.numberOfReviews || 0} reviews)</span> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* About Section */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-xl font-bold mb-4">About Hostel</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {hostel.description || "No description provided for this hostel yet."}
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-12">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Owner</p>
                                    <p className="font-semibold text-slate-900">{hostel.ownerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Contact Phone</p>
                                    <p className="font-semibold text-slate-900">{hostel.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Contact Email</p>
                                    <p className="font-semibold text-slate-900">{hostel.email}</p>
                                </div>
                            </div>
                        </section>

                        {/* Facilities Section */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-xl font-bold mb-6">Facilities</h2>

                            {hostel.facilities && hostel.facilities.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {hostel.facilities.map((fac, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 text-center"
                                        >
                                            {fac}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No facilities available</p>
                            )}
                        </section>


                        {/* Room Types Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Room Inventory Selection</h2>
                                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {rooms.length} Rooms Found
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentRooms.length > 0 ? (
                                    currentRooms.map((room) => (
                                        <div key={room._id} className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden p-6 flex flex-col gap-4 relative group ${selectedRoom?._id === room._id ? 'border-primary ring-4 ring-primary/5 shadow-xl shadow-primary/10' : 'border-slate-200'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="material-symbols-outlined text-slate-400 text-base">meeting_room</span>
                                                        <h3 className="font-black text-lg text-slate-900 leading-none">Room {room.roomNumber}</h3>
                                                    </div>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{formatRoomType(room.type)}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${room.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                                                    {room.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 py-2">
                                                {hostel.facilities.slice(0, 4).map((fac, idx) => (
                                                    <span key={idx} className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-[#4F7C82] bg-[#B8E3E9]/20 px-2 py-0.5 rounded-md border border-[#B8E3E9]/30">
                                                        <span className="material-symbols-outlined text-[10px]">{fac.toLowerCase() === 'wifi' ? 'wifi' : 'check'}</span>
                                                        {fac}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Occupancy</span>
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                        <span className="material-symbols-outlined text-base">groups</span>
                                                        <span>{room.capacity} Person</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</span>
                                                    <div className="flex items-center gap-1 font-black text-primary">
                                                        <span>₹{room.price}</span>
                                                        <span className="text-[9px] opacity-60">/ MO</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedRoom(room)}
                                                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedRoom?._id === room._id
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[0.98]'
                                                    : 'bg-slate-50 text-slate-500 hover:bg-primary/5 hover:text-primary'
                                                }`}
                                            >
                                                {selectedRoom?._id === room._id ? 'Selected Unit' : 'Select for Booking'}
                                            </button>
                                            
                                            {/* Selection Marker */}
                                            {selectedRoom?._id === room._id && (
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-primary flex items-center justify-center rounded-bl-full animate-fade-in">
                                                    <span className="material-symbols-outlined text-white font-black text-xl mb-2 ml-2">check</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">sensor_door</span>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No active units listed for this residency.</p>
                                    </div>
                                )}
                            </div>
                            
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <button 
                                        onClick={() => setCurrentRoomPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentRoomPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentRoomPage(idx + 1)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                                                currentRoomPage === idx + 1
                                                    ? 'bg-[#5048e5] text-white'
                                                    : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => setCurrentRoomPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentRoomPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Reviews Section */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    User Reviews
                                    <span className="px-3 py-1 bg-[#5048e5]/10 text-[#5048e5] text-xs font-bold rounded-full">
                                        {hostel.numberOfReviews || 0} reviews
                                    </span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                                {/* Rating Summary Box */}
                                <div className="md:col-span-4 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
                                    <span className="text-6xl font-black text-slate-900 tracking-tighter">{hostel.averageRating || "0.0"}</span>
                                    <div className="flex text-amber-500 my-4 gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span 
                                                key={s} 
                                                className="material-symbols-outlined text-2xl" 
                                                style={s <= Math.round(hostel.averageRating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                                            >
                                                {s <= Math.round(hostel.averageRating) ? 'star' : (s - 0.5 <= hostel.averageRating ? 'star_half' : 'star')}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Rating</span>
                                </div>

                                {/* Rating Bars */}
                                <div className="md:col-span-8 flex flex-col justify-center space-y-4">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                        const pct = hostel.numberOfReviews > 0 ? (count / hostel.numberOfReviews) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-4 group">
                                                <div className="flex items-center gap-1 w-12 shrink-0">
                                                    <span className="text-sm font-bold text-slate-600">{star}</span>
                                                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                </div>
                                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-[#5048e5] h-full transition-all duration-700 ease-out rounded-full shadow-sm" 
                                                        style={{ width: `${pct}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-400 w-10 text-right">{Math.round(pct)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Individual Reviews List */}
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review._id} className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100 shrink-0 capitalize text-slate-500 font-bold">
                                                        {review.userId?.name?.[0] || 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-none mb-1">{review.userId?.name || 'Anonymous'}</p>
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <span 
                                                                    key={s} 
                                                                    className={`material-symbols-outlined text-sm ${s <= review.rating ? 'text-amber-500' : 'text-slate-200'}`} 
                                                                    style={s <= review.rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                                >
                                                                    star
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="pl-16">
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <span className="material-symbols-outlined text-slate-300 text-3xl font-light">reviews</span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </section>


                    </div>

                    {/* Right Sticky Panel */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden shrink-0">
                                                <img
                                                    src={images[0]}
                                                    className="w-full h-full object-cover"
                                                    alt="Thumbnail"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{formatRoomType(selectedRoom?.type || '')}</p>
                                                {/* <p className="text-xs text-slate-500">1 Room • 1 Guest</p> */}
                                            </div>
                                        </div>
                                        {/* <button className="text-xs font-bold text-[#5048e5]">Change</button> */}
                                    </div>

                                    <div className="space-y-3 border-b border-slate-100 pb-4 mt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Monthly Rent</span>
                                            <span className="font-medium">₹{selectedRoom?.price || hostel.price || 850}.00</span>
                                        </div>
                            
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Security Deposit</span>
                                            <span className="font-medium">₹{(selectedRoom?.price || hostel.price || 850) * 0.5}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-lg">Total Monthly</span>
                                        <span className="font-bold text-2xl text-[#5048e5]">₹{(selectedRoom?.price || hostel.price || 850) }.0</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (selectedRoom) {
                                                const finalRoomId = selectedRoom._id.startsWith('temp') ? 'default' : selectedRoom._id;
                                                router.push(`/hostel/${hostel._id}/book/${finalRoomId}?type=${encodeURIComponent(selectedRoom.type)}`);
                                            } else {
                                                showAlert("Selection Required", "Please choose a room type from the available options before proceeding with your booking.", "error");
                                            }
                                        }}
                                        className="w-full bg-[#5048e5] hover:bg-[#5048e5]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#5048e5]/20 transition-all active:scale-[0.98]"
                                    >
                                        Book This Hostel
                                    </button>

                                </div>
                            </div>

                            {/* <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Verified Stay</p>
                                    <p className="text-xs text-slate-500">StaySync Quality Guaranteed</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
