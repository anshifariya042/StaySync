"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore as useAuth } from '@/store/useAuthStore';
import api from "@/lib/api";
import Link from "next/link";
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
    images: string[];
    price: number;
}

export default function BookRoom() {
    const { id: hostelId, roomId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRoomType = searchParams.get('type');
    const { user } = useAuth();
    const { showAlert } = useModal();

    const [hostel, setHostel] = useState<Hostel | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        moveInDate: "",
        idProof: null as File | null,
        additionalNotes: ""
    });

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
                        type: currentRoomType || 'Standard Room',
                        capacity: currentRoomType?.includes('Double') ? 2 : 1,
                        price: hostelRes.data.hostel.price,
                        status: 'available'
                    });
                } else {
                    const foundRoom = roomsRes.data.find((r: Room) => r._id === roomId);
                    setRoom(foundRoom || null);
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (hostelId && roomId) {
            fetchDetails();
        }
    }, [hostelId, roomId]);

    const getRoomTypeLabel = (type: string) => {
        const mapping: { [key: string]: string } = {
            'Standard': 'single',
            'AC': 'Two sharing',
            'Deluxe': 'Four sharing',
            'Standard Room': 'single'
        };
        return mapping[type] || type;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('hostelId', hostelId as string);
            formDataToSend.append('roomId', roomId as string);
            formDataToSend.append('fullName', user.name);
            formDataToSend.append('email', user.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('moveInDate', formData.moveInDate);
            const finalType = getRoomTypeLabel(room?.type || currentRoomType || 'Standard Room');
            formDataToSend.append('roomType', finalType);
            formDataToSend.append('additionalNotes', formData.additionalNotes);
            formDataToSend.append('totalAmount', ((room?.price || hostel?.price || 0) + ((room?.price || hostel?.price || 0) * 0.5)).toString());
            formDataToSend.append('advancePayment', ((room?.price || hostel?.price || 0) * 0.5).toString());
            
            if (formData.idProof) {
                formDataToSend.append('idProof', formData.idProof);
            }

            await api.post('/bookings', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Redirect to confirmation page
            const params = new URLSearchParams();
            params.append('moveInDate', formData.moveInDate);
            params.append('type', getRoomTypeLabel(room?.type || 'Standard Room'));
            router.push(`/hostel/${hostelId}/book/${roomId}/confirmation?${params.toString()}`);
        } catch (error: any) {
            console.error("Booking failed:", error);
            if (error.response?.status === 401) {
                showAlert("Identity Expired", "Your security session has expired. Please re-authenticate to continue with your booking.", "error");
                router.push('/login');
            } else {
                showAlert("System Error", error.response?.data?.message || "Booking synchronization failed. Please try again or contact support.", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
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
                <h2 className="text-2xl font-bold">Details Not Found</h2>
                <button onClick={() => router.back()} className="mt-4 text-[#5048e5] font-bold">Go Back</button>
            </div>
        );
    }

    const monthlyRent = room.price || hostel.price || 0;
    const securityDeposit = monthlyRent * 0.5;
    const totalAmount = monthlyRent + securityDeposit;

    return (
        <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen flex flex-col">
            <header className="w-full max-w-2xl mx-auto px-4 pt-8 pb-4 flex items-center gap-4">
                {/* <button onClick={() => router.back()} className="p-2 hover:bg-[#5048e5]/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-slate-700">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold tracking-tight">Book Your Room</h1> */}
            </header>

            <main className="w-full max-w-2xl mx-auto px-4 pb-20 flex-1">
                {/* Hostel/Room Summary Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5048e5]/10 mb-6 flex gap-4 items-center">
                    <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            alt={hostel.name}
                            className="h-full w-full object-cover"
                            src={hostel.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold leading-tight">{hostel.name}</h2>
                        <p className="text-slate-500 text-sm">{getRoomTypeLabel(room.type) || `Room ${room.roomNumber}`}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[#5048e5] font-semibold">₹{monthlyRent} <span className="text-xs font-normal text-slate-400">/ month</span></span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[#5048e5]/10 space-y-6">
                    {/* Personal Details */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    className="bg-[#f6f6f8] border-[#5048e5]/10 rounded-lg h-12 px-4 text-slate-500 cursor-not-allowed"
                                    readOnly
                                    type="text"
                                    value={user?.name || ""}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    className="bg-[#f6f6f8] border-[#5048e5]/10 rounded-lg h-12 px-4 text-slate-500 cursor-not-allowed"
                                    readOnly
                                    type="email"
                                    value={user?.email || ""}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                          <input
  className="bg-white border-slate-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-[#5048e5] focus:border-[#5048e5] transition-all"
  placeholder="+1 (555) 000-0000"
  type="tel"
  value={formData.phone}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ""); // remove non-digits
    setFormData({ ...formData, phone: onlyNumbers });
  }}
  required
/>

                        </div>
                    </section>

                    {/* Booking Preferences */}
                    <section className="space-y-4 pt-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Booking Preferences</h3>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Preferred Move-in Date</label>
                            <div className="relative">
                                <input
                                    className="w-full bg-white border-slate-200 rounded-lg h-12 px-4 pr-10 focus:ring-2 focus:ring-[#5048e5] focus:border-[#5048e5]"
                                    type="date"
                                    value={formData.moveInDate}
                                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">ID Proof (Passport/National ID)</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="material-symbols-outlined text-slate-400 mb-2">cloud_upload</span>
                                    <p className="text-sm text-slate-500">
                                        {formData.idProof ? formData.idProof.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG (max. 5MB)</p>
                                </div>
                                <input
                                    className="hidden"
                                    type="file"
                                    onChange={(e) => setFormData({ ...formData, idProof: e.target.files?.[0] || null })}
                                />
                            </label>
                        </div>
                    </section>

                    {/* Payment Summary */}
                    <section className="pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600">Monthly Rent</span>
                            <span className="font-medium">₹{monthlyRent.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600">Security Deposit</span>
                            <span className="font-medium">₹{securityDeposit.toFixed(2)}</span>
                        </div>
                        <div className="bg-[#5048e5]/5 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-900 font-bold">Total Amount Due</span>
                                <span className="text-[#5048e5] text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-[#5048e5] uppercase">Advance Payment Required</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <input
                                        className="w-full bg-white border-[#5048e5]/20 rounded-lg h-10 pl-8 pr-4 text-[#5048e5] font-bold focus:ring-[#5048e5]"
                                        type="number"
                                        value={securityDeposit}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full bg-[#5048e5] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <span>{isSubmitting ? "Processing..." : "Proceed to Confirm"}</span>
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">By proceeding, you agree to StaySync Terms of Service and Privacy Policy.</p>
                    </section>
                </form>
            </main>

        </div>
    );
}
