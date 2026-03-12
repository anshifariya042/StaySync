"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

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
    createdAt: string;
}

export default function HostelDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [hostel, setHostel] = useState<Hostel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (id) {
                    const [hostelRes, roomsRes] = await Promise.all([
                        api.get(`/hostels/${id}`),
                        api.get(`/hostels/${id}/rooms`)
                    ]);
                    setHostel(hostelRes.data.hostel);
                    const fetchedRooms = roomsRes.data || [];
                    setRooms(fetchedRooms);
                    if (fetchedRooms.length > 0) {
                        setSelectedRoom(fetchedRooms[0]);
                    }
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

    // Default values if data is missing
    const primaryImage = hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    const hasFacility = (keyword: string) => {
        return hostel.facilities.some(f => f.toLowerCase().includes(keyword.toLowerCase()));
    };

    return (
        <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                {/* <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#5048e5] mb-6 transition-colors font-medium"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to search
                </button> */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Content Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Section */}
                        <section className="space-y-6">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200">
                                <img
                                    src={primaryImage}
                                    className="w-full h-full object-cover"
                                    alt={hostel.name}
                                />

                            </div>

                            <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{hostel.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-sm">{hostel.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-sm font-semibold text-slate-900">4.8</span>
                                            {/* <span className="text-sm">(120 reviews)</span> */}
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
                                    <p className="text-sm text-slate-500 mb-1">Owner / Manager</p>
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
                            <h2 className="text-xl font-bold">Available Room Types</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <div key={room._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{room.type || `Room ${room.roomNumber}`}</h3>
                                                    <p className="text-sm text-slate-500">Room Number: {room.roomNumber}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${room.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {room.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base">person</span>
                                                    <span>{room.capacity} Person</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold text-[#5048e5]">${room.price || hostel.price}</span>
                                                    <span className="text-xs text-slate-500">per month</span>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedRoom(room)}
                                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${selectedRoom?._id === room._id
                                                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                        : 'bg-[#5048e5] hover:bg-[#5048e5]/90 text-white'
                                                        }`}
                                                >
                                                    {selectedRoom?._id === room._id ? 'Selected' : 'Select'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    hostel.roomTypes && hostel.roomTypes.length > 0 ? (
                                        hostel.roomTypes.map((type, idx) => (
                                            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{type}</h3>
                                                        <p className="text-sm text-slate-500">Available Room Type</p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Available</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">person</span>
                                                        <span>{type.includes('Double') ? '2' : type.includes('Triple') ? '3' : type.includes('Four') ? '4' : '1'} Person</span>
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-bold text-[#5048e5]">${hostel.price}</span>
                                                        <span className="text-xs text-slate-500">per month</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedRoom({ _id: `temp-${idx}`, type, price: hostel.price, status: 'available', roomNumber: 'TBD', capacity: 1 })}
                                                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${selectedRoom?.type === type
                                                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                                : 'bg-[#5048e5] hover:bg-[#5048e5]/90 text-white'
                                                            }`}
                                                    >
                                                        {selectedRoom?.type === type ? 'Selected' : 'Select'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white border-2 border-[#5048e5] rounded-xl overflow-hidden p-5 flex flex-col gap-4 relative">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">Standard Room</h3>
                                                    <p className="text-sm text-slate-500">Based on default hostel pricing</p>
                                                </div>
                                                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Available</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base">square_foot</span>
                                                    <span>Standard Setup</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold text-[#5048e5]">${hostel.price || 850}</span>
                                                    <span className="text-xs text-slate-500">per month</span>
                                                </div>
                                                <button
                                                    className="bg-amber-100 text-amber-700 border border-amber-200 px-6 py-2.5 rounded-lg text-sm font-bold"
                                                >
                                                    Selected
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Reviews Section Placeholder */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-xl font-bold mb-6">User Reviews</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl text-center">
                                    <span className="text-5xl font-bold text-slate-900">4.8</span>
                                    <div className="flex text-amber-500 my-2">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined">star_half</span>
                                    </div>
                                    <span className="text-sm text-slate-500">Based on 120 reviews</span>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { star: 5, pct: 85 },
                                        { star: 4, pct: 10 },
                                        { star: 3, pct: 3 },
                                        { star: 2, pct: 1 },
                                        { star: 1, pct: 1 },
                                    ].map((row) => (
                                        <div key={row.star} className="flex items-center gap-3">
                                            <span className="text-sm w-4 text-center">{row.star}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full" style={{ width: `${row.pct}%` }}></div>
                                            </div>
                                            <span className="text-sm text-slate-500 w-8">{row.pct}%</span>
                                        </div>
                                    ))}
                                </div>
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
                                                    src={primaryImage}
                                                    className="w-full h-full object-cover"
                                                    alt="Thumbnail"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{selectedRoom?.type || ''}</p>
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
                                                alert("Please select a room first!");
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
