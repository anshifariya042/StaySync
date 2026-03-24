"use client"

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function RegisterHostel() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

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

            await api.post('/hostels/register-hostel', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
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
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Hostel Registered!</h2>
                <p className="text-text-gray mt-2">Your admin account has been created. Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#F9FAFB] font-sans text-foreground">
            <header className="sticky top-0 z-50 flex items-center bg-[#F9FAFB]/80 backdrop-blur-md p-4 justify-between border-b border-border-color shadow-sm">
                <div
                    onClick={() => router.back()}
                    className="text-primary flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                >
                    <span className="material-symbols-outlined font-bold">arrow_back</span>
                </div>
                <h2 className="text-foreground text-sm font-black uppercase tracking-widest flex-1 text-center">Register Hostel</h2>
                <div className="size-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary font-bold">info</span>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto pb-32">
                <form id="register-hostel-form" onSubmit={handleSubmit} className="px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Column 1: Core Details */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-border-color space-y-10">
                            <section className="space-y-6">
                                <h3 className="text-foreground text-xl font-bold border-l-4 border-primary pl-4">Hostel Details</h3>
                                <div className="space-y-5">
                                    <label className="flex flex-col w-full">
                                        <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Hostel Name</span>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 h-14 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                            placeholder="e.g. Blue Sky Residency"
                                            type="text"
                                            required
                                        />
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Owner Full Name</span>
                                        <input
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 h-14 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                            placeholder="John Doe"
                                            type="text"
                                            required
                                        />
                                    </label>
                                    <div className="space-y-5">
                                        <label className="flex flex-col w-full">
                                            <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Contact Email</span>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 h-14 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                                placeholder="owner@staysync.com"
                                                type="email"
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Create Password</span>
                                            <input
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 h-14 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                                placeholder="••••••••"
                                                type="password"
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Phone Number</span>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 h-14 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                                placeholder="+1 (555) 000-0000"
                                                type="tel"
                                                required
                                            />
                                        </label>
                                    </div>
                                    <label className="flex flex-col w-full">
                                        <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Location</span>
                                        <div className="relative">
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full rounded-xl text-foreground border border-border-color bg-white focus:border-primary h-14 pl-12 p-4 text-sm font-bold outline-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                                placeholder="City, Street Address"
                                                type="text"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none font-bold">location_on</span>
                                        </div>
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-2 ml-1">Monthly Price ($)</span>
                                        <div className="relative">
                                            <input
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                className="w-full rounded-xl text-foreground border border-border-color bg-slate-50 h-14 pl-12 p-4 text-xl font-black text-primary outline-none focus:border-primary transition-all shadow-inner"
                                                placeholder="0.00"
                                                type="number"
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none font-bold">payments</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-foreground text-sm font-black uppercase tracking-widest border-l-4 border-primary pl-4">Capacity</h3>
                                <label className="flex flex-col w-full">
                                    <span className="text-text-gray text-xs font-bold uppercase tracking-widest mb-3 ml-1">Total Number of Rooms</span>
                                    <div className="flex items-center gap-4">
                                        <input
                                            name="totalRooms"
                                            className="flex-1 rounded-xl text-foreground border border-border-color bg-[#F9FAFB] h-14 p-4 text-lg font-black outline-none text-center"
                                            type="number"
                                            value={formData.totalRooms}
                                            onChange={handleChange}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={decrementRooms}
                                                className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all font-black"
                                            >
                                                <span className="material-symbols-outlined font-black">remove</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={incrementRooms}
                                                className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all font-black"
                                            >
                                                <span className="material-symbols-outlined font-black">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </label>
                            </section>
                        </div>

                        {/* Column 2: Specifics & Multimedia */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-border-color space-y-10">
                            <section className="space-y-6">
                                <h3 className="text-foreground text-xl font-bold border-l-4 border-primary pl-4">Facilities</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'WiFi', label: 'Free Wi-Fi' },
                                        { id: 'Laundry', label: 'Laundry' },
                                        { id: 'CCTV', label: 'CCTV' },
                                        { id: 'Mess', label: 'Mess/Food' },
                                        { id: 'AC', label: 'Air Condition' },
                                        { id: 'Parking', label: 'Parking' }
                                    ].map((facility) => (
                                        <label key={facility.id} className="flex items-center gap-3 p-4 rounded-2xl border border-border-color bg-slate-50/50 cursor-pointer hover:border-primary hover:bg-white transition-all group">
                                            <input
                                                type="checkbox"
                                                checked={formData.facilities.includes(facility.id)}
                                                onChange={() => toggleFacility(facility.id)}
                                                className="rounded-lg text-primary focus:ring-primary size-5 border-border-color"
                                            />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-text-gray group-hover:text-primary transition-colors">{facility.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-foreground text-sm font-black uppercase tracking-widest border-l-4 border-primary pl-4">Description</h3>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-[1.5rem] text-foreground border border-border-color bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[140px] p-5 text-sm font-medium outline-none resize-none transition-all placeholder:text-text-gray/30 shadow-sm"
                                    placeholder="Describe your hostel's vibe..."
                                ></textarea>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-foreground text-sm font-black uppercase tracking-widest border-l-4 border-primary pl-4">Hostel Images</h3>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-full aspect-video rounded-[2rem] border-2 border-dashed border-border-color bg-slate-50 hover:border-primary hover:bg-white transition-all cursor-pointer group shadow-sm"
                                >
                                    <div className="flex flex-col items-center gap-3 text-center px-4">
                                        <span className="material-symbols-outlined text-5xl text-primary font-bold">add_photo_alternate</span>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-text-gray">Upload Images</p>
                                        <p className="text-[10px] text-text-gray/50 font-bold">PNG or JPG (Max 5MB)</p>
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

                                <div className="grid grid-cols-4 gap-3">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="aspect-square rounded-xl bg-slate-200 relative overflow-hidden group border border-border-color shadow-sm">
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
                                                className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                                            >
                                                <span className="material-symbols-outlined font-black">delete</span>
                                            </div>
                                        </div>
                                    ))}
                                    {[...Array(Math.max(0, 4 - selectedImages.length))].map((_, i) => (
                                        <div
                                            key={`empty-${i}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl bg-[#F9FAFB] border-2 border-dashed border-border-color flex items-center justify-center cursor-pointer hover:border-primary transition-all opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-text-gray/30 font-bold">add</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-xs font-black uppercase tracking-widest text-center mt-12 shadow-sm animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="max-w-md mx-auto mt-16 pb-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Register Hostel
                                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}