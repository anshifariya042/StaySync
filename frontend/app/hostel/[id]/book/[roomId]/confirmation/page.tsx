"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

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
    location: string;
    images: string[];
    price: number;
}

export default function BookingConfirmation() {
    const { id: hostelId, roomId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [hostel, setHostel] = useState<Hostel | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    const moveInDate = searchParams.get('moveInDate') || "Not specified";
    const bookingType = searchParams.get('type') || "Standard Room";

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [hostelRes, roomsRes] = await Promise.all([
                    api.get(`/hostels/${hostelId}`),
                    api.get(`/hostels/${hostelId}/rooms`)
                ]);

                setHostel(hostelRes.data.hostel);

                if (roomId === 'default') {
                    setRoom({
                        _id: 'default',
                        roomNumber: 'TBD',
                        type: bookingType,
                        capacity: 1,
                        price: hostelRes.data.hostel.price,
                        status: 'available'
                    });
                } else {
                    const foundRoom = roomsRes.data.find((r: Room) => r._id === roomId);
                    setRoom(foundRoom || null);
                }
            } catch (error) {
                console.error("Error fetching confirmation details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (hostelId && roomId) {
            fetchDetails();
        }
    }, [hostelId, roomId, bookingType]);

    const getRoomTypeLabel = (type: string) => {
        const mapping: { [key: string]: string } = {
            'Standard': 'single',
            'AC': 'Two sharing',
            'Deluxe': 'Four sharing',
            'Standard Room': 'single'
        };
        return mapping[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f6f6f8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5048e5]"></div>
            </div>
        );
    }

    if (!hostel || !room) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f6f8] text-slate-600">
                <h2 className="text-2xl font-bold">Booking Not Found</h2>
                <button onClick={() => router.push('/')} className="mt-4 text-[#5048e5] font-bold">Go Home</button>
            </div>
        );
    }

    const monthlyRent = room.price || hostel.price || 0;
    const securityDeposit = monthlyRent * 0.5;
    const totalAmount = monthlyRent + securityDeposit;

    return (
        <div className="bg-[#f6f6f8] font-sans text-slate-900 min-h-screen flex flex-col">
            {/* <header className="flex items-center bg-white border-b border-slate-200 p-4 sticky top-0 z-10"> */}
                {/* <div className="flex-1">
                    <button onClick={() => router.push('/')} className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 transition-colors">
                    </button>
                </div> */}
                {/* <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Confirmation</h2> */}
                {/* <div className="flex-1"></div>
            </header> */}

            <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex flex-col items-center gap-6 p-8 text-center border-b border-slate-100">
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">Booking Request Submitted Successfully!</h1>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Your booking request has been sent to the hostel admin. You will be notified once approved.
                            </p>
                        </div>
                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                            <img
                                alt={hostel.name}
                                className="w-full h-full object-cover"
                                src={hostel.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                            />
                            <div className="absolute bottom-4 left-4 z-20 text-white text-left">
                                <p className="font-bold text-lg">{hostel.name}</p>
                                <p className="text-xs opacity-90">{hostel.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Booking Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500 text-sm">Hostel name</span>
                                <span className="font-medium text-sm">{hostel.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500 text-sm">Room type</span>
                                <span className="font-medium text-sm">{getRoomTypeLabel(room.type)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500 text-sm">Move-in date</span>
                                <span className="font-medium text-sm">
                                    {moveInDate !== "Not specified"
                                        ? new Date(moveInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                        : moveInDate}
                                </span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-slate-900">Total Price</span>
                                <span className="text-xl font-bold text-[#5048e5]">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 flex flex-col gap-3">
                        <button
                            onClick={() => router.push('/user/my-hostel')}
                            className="w-full bg-[#5048e5] hover:bg-[#5048e5]/90 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-sm active:scale-[0.98]"
                        >
                            View My Hostel
                        </button>
                        <button
                            onClick={() => router.push('/explore-hostels')}
                            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg transition-all hover:bg-slate-50 active:scale-[0.98]"
                        >
                            Explore More Hostels
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
