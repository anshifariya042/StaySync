"use client"

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function RegisterHostel() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        location: '',
        description: '',
        totalRooms: 10,
        price: 0,
        facilities: ['WiFi', 'CCTV'] as string[],
        roomTypes: [] as string[]
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const val = type === 'number' ? (value === '' ? '' : Number(value)) : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const toggleFacility = (facility: string) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }))
    }

    const toggleRoomType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            roomTypes: prev.roomTypes.includes(type)
                ? prev.roomTypes.filter(t => t !== type)
                : [...prev.roomTypes, type]
        }))
    }

    const incrementRooms = () => {
        setFormData(prev => ({ ...prev, totalRooms: prev.totalRooms + 1 }))
    }

    const decrementRooms = () => {
        setFormData(prev => ({ ...prev, totalRooms: Math.max(0, prev.totalRooms - 1) }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)])
        }
    }

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!formData.name || !formData.ownerName || !formData.phone || !formData.location) {
            setError('Please fill all required fields.')
            setIsLoading(false)
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.')
            setIsLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.')
            setIsLoading(false)
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('ownerName', formData.ownerName)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('password', formData.password)
            formDataToSend.append('phone', formData.phone)
            formDataToSend.append('location', formData.location)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('totalRooms', formData.totalRooms.toString())
            formDataToSend.append('price', formData.price.toString())

            formData.facilities.forEach(facility => {
                formDataToSend.append('facilities', facility)
            })

            formData.roomTypes.forEach(type => {
                formDataToSend.append('roomTypes', type)
            })

            selectedImages.forEach(file => {
                formDataToSend.append('images', file)
            })

            // Use the axios instance for consistency
            const response = await api.post('/hostels/register-hostel', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const data = response.data;
            setSuccess(true)
            setTimeout(() => router.push('/login'), 2000)
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mb-6 border border-[#16A34A]/20">
                    <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Hostel Registered!</h2>
                <p className="text-[#374151] mt-2">Your admin account has been created. Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#F9FAFB] font-sans text-[#111827]">
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <header className="sticky top-0 z-50 flex items-center bg-[#F9FAFB]/80 backdrop-blur-md p-4 justify-between border-b border-[#D1D5DB]">
                <div
                    onClick={() => router.back()}
                    className="text-[#4F46E5] flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-[#4F46E5]/10 cursor-pointer transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-[#111827] text-lg font-bold leading-tight tracking-tight flex-1 text-center">Register Hostel</h2>
                <div className="size-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#4F46E5]">info</span>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto pb-32">
                <form id="register-hostel-form" onSubmit={handleSubmit} className="px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1: Core Details */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D1D5DB] space-y-8">
                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Hostel Details</h3>
                                <div className="space-y-4">
                                    <label className="flex flex-col w-full">
                                        <span className="text-[#374151] text-sm font-semibold pb-2">Hostel Name</span>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                            placeholder="e.g. Blue Sky Residency"
                                            type="text"
                                            required
                                        />
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="text-[#374151] text-sm font-semibold pb-2">Owner Full Name</span>
                                        <input
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                            placeholder="John Doe"
                                            type="text"
                                            required
                                        />
                                    </label>
                                    <div className="space-y-4">
                                        <label className="flex flex-col w-full">
                                            <span className="text-[#374151] text-sm font-semibold pb-2">Contact Email</span>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                                placeholder="owner@staysync.com"
                                                type="email"
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-[#374151] text-sm font-semibold pb-2">Create Password</span>
                                            <input
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                                placeholder="••••••••"
                                                type="password"
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-[#374151] text-sm font-semibold pb-2">Phone Number</span>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                                placeholder="+1 (555) 000-0000"
                                                type="tel"
                                                required
                                            />
                                        </label>
                                    </div>
                                    <label className="flex flex-col w-full">
                                        <span className="text-[#374151] text-sm font-semibold pb-2">Location</span>
                                        <div className="relative">
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 pl-12 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                                placeholder="City, Street Address"
                                                type="text"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5] pointer-events-none">location_on</span>
                                        </div>
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="text-[#374151] text-sm font-semibold pb-2">Monthly Price ($)</span>
                                        <div className="relative">
                                            <input
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                className="flex w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 h-14 pl-12 p-4 text-base outline-none transition-all placeholder:text-[#D1D5DB]"
                                                placeholder="0.00"
                                                type="number"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5] pointer-events-none">payments</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Capacity</h3>
                                <label className="flex flex-col w-full">
                                    <span className="text-[#374151] text-sm font-semibold pb-2">Total Number of Rooms</span>
                                    <div className="flex items-center gap-4">
                                        <input
                                            name="totalRooms"
                                            className="flex-1 rounded-xl text-[#111827] border border-[#D1D5DB] bg-[#F9FAFB] h-14 p-4 text-base outline-none"
                                            type="number"
                                            value={formData.totalRooms}
                                            onChange={handleChange}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={decrementRooms}
                                                className="size-14 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center hover:bg-[#4F46E5]/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">remove</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={incrementRooms}
                                                className="size-14 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center hover:bg-[#4F46E5]/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </label>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Room Types Available</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { id: 'Single Bed', label: 'Single Bed' },
                                        { id: 'Double Sharing', label: 'Double Sharing' },
                                        { id: 'Triple Sharing', label: 'Triple Sharing' },
                                        { id: 'Four Sharing', label: 'Four Sharing' }
                                    ].map((type) => (
                                        <label key={type.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] cursor-pointer hover:border-[#6366F1] transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.roomTypes.includes(type.id)}
                                                onChange={() => toggleRoomType(type.id)}
                                                className="rounded text-[#4F46E5] focus:ring-[#6366F1] size-5 border-[#D1D5DB]"
                                            />
                                            <span className="text-sm font-medium text-[#374151]">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Column 2: Specifics & Multimedia */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D1D5DB] space-y-8">
                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Facilities</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'WiFi', label: 'Free Wi-Fi' },
                                        { id: 'Laundry', label: 'Laundry' },
                                        { id: 'CCTV', label: 'CCTV' },
                                        { id: 'Mess', label: 'Mess/Food' },
                                        { id: 'AC', label: 'Air Condition' },
                                        { id: 'Parking', label: 'Parking' }
                                    ].map((facility) => (
                                        <label key={facility.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] cursor-pointer hover:border-[#6366F1] transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.facilities.includes(facility.id)}
                                                onChange={() => toggleFacility(facility.id)}
                                                className="rounded text-[#4F46E5] focus:ring-[#6366F1] size-5 border-[#D1D5DB]"
                                            />
                                            <span className="text-sm font-medium text-[#374151]">{facility.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Description</h3>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-xl text-[#111827] border border-[#D1D5DB] bg-white focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 min-h-[120px] p-4 text-base outline-none resize-none transition-all placeholder:text-[#D1D5DB]"
                                    placeholder="Describe your hostel's vibe..."
                                ></textarea>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[#111827] text-xl font-bold border-l-4 border-[#4F46E5] pl-3">Hostel Images</h3>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-colors cursor-pointer group"
                                >
                                    <div className="flex flex-col items-center gap-2 text-center px-4">
                                        <span className="material-symbols-outlined text-4xl text-[#4F46E5]">cloud_upload</span>
                                        <p className="text-sm font-semibold text-[#374151]">Upload Images</p>
                                        <p className="text-xs text-slate-500">PNG or JPG (Max 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="aspect-square rounded-lg bg-slate-200 relative overflow-hidden group border border-[#D1D5DB]">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeImage(index)
                                                }}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </div>
                                        </div>
                                    ))}
                                    {[...Array(Math.max(0, 3 - selectedImages.length))].map((_, i) => (
                                        <div
                                            key={`empty-${i}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-lg bg-[#F9FAFB] border-2 border-dashed border-[#D1D5DB] flex items-center justify-center cursor-pointer hover:border-[#4F46E5] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[#D1D5DB]">add</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-[#DC2626] p-4 rounded-xl border border-[#DC2626]/20 text-sm font-bold text-center mt-8">
                            {error}
                        </div>
                    )}
                </form>
            </main>

            <footer className="bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg ">
                <div className="max-w-5xl mx-auto flex justify-center p-6 pb-10">
                    <button
                        type="submit"
                        form="register-hostel-form"
                        disabled={isLoading}
                        className="w-full max-w-md bg-[#4F46E5] hover:bg-[#4338CA] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#4F46E5]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : 'Register Hostel'}
                    </button>
                </div>
            </footer>
        </div>
    )
}