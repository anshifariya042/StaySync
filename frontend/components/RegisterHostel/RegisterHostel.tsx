"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function RegisterHostel() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        location: '',
        description: '',
        totalRooms: 10,
        imageUrl: '',
        facilities: ['WiFi', 'CCTV'] as string[]
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleFacility = (facility: string) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }))
    }

    const incrementRooms = () => {
        setFormData(prev => ({ ...prev, totalRooms: prev.totalRooms + 1 }))
    }

    const decrementRooms = () => {
        setFormData(prev => ({ ...prev, totalRooms: Math.max(0, prev.totalRooms - 1) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Form Validation
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
            const submissionData = {
                ...formData,
                images: formData.imageUrl ? [formData.imageUrl] : []
            }
            await api.post('/hostels/register-hostel', submissionData)
            setSuccess(true)
            setTimeout(() => router.push('/login'), 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Hostel Registered!</h2>
                <p className="text-gray-500 mt-2">Your admin account has been created. Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="max-w-screen-md mx-auto bg-white min-h-screen font-sans selection:bg-indigo-100">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <button
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900">Register Hostel</h1>
                <button aria-label="Information" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>
            </header>

            <main className="p-6 space-y-8 pb-4">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hostel Details Section */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-[#4F46E5] pl-3 mb-6">Hostel Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Blue Sky Residency"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Full Name</label>
                                    <input
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        placeholder="John Doe"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        placeholder="owner@staysync.com"
                                        type="email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                            placeholder="Enter a strong password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const onlyNums = e.target.value.replace(/[^0-9]/g, '')
                                            setFormData(prev => ({ ...prev, phone: onlyNums }))
                                        }}
                                        className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Enter phone number"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        required
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            </svg>
                                        </span>
                                        <input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="rounded-xl border border-gray-300 pl-10 pr-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                            placeholder="City, Street Address"
                                            type="text"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="rounded-xl border border-gray-300 px-4 py-3 w-full transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 resize-none"
                                        placeholder="Add a brief description of your hostel"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Capacity Section */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-[#4F46E5] pl-3 mb-6">Capacity & Rooms</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total Number of Rooms</label>
                                <div className="flex items-center w-full max-w-[280px] bg-white border border-gray-300 rounded-xl overflow-hidden">
                                    <input
                                        className="w-full border-none focus:ring-0 text-center text-gray-900 font-medium bg-transparent cursor-default"
                                        readOnly
                                        type="number"
                                        value={formData.totalRooms}
                                    />
                                    <div className="flex">
                                        <button
                                            type="button"
                                            className="bg-indigo-600  px-4 py-3 hover:bg-indigo-700 transition-colors border-l border-indigo-500 flex items-center justify-center"
                                            onClick={decrementRooms}
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-indigo-600  px-4 py-3 hover:bg-indigo-700 transition-colors border-l border-indigo-500 flex items-center justify-center"
                                            onClick={incrementRooms}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Images Section */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-800 mb-6 font-sans">Images</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    name="file"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="rounded-xl border border-gray-300 px-4 py-3 w-full focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                                    placeholder="https://your-hostel-images.com/photo1.jpg"
                                    type="url"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Facilities Section */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-[#4F46E5] pl-3 mb-6">Facilities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'WiFi', label: 'Free Wi-Fi', icon: true, iconSvg: <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.142 0M1.414 8.414a16.5 16.5 0 0121.172 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> },
                                { id: 'CCTV', label: 'CCTV', icon: true, iconSvg: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> },
                                { id: 'Laundry', label: 'Laundry' },
                                { id: 'AC', label: 'Air Condition' },
                                { id: 'Mess', label: 'Mess/Food' },
                                { id: 'Parking', label: 'Parking' }
                            ].map((facility) => (
                                <label key={facility.id} className={`flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all ${formData.facilities.includes(facility.id) ? 'bg-indigo-50 border-indigo-300 shadow-sm' : ''}`}>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 pointer-events-none"
                                        checked={formData.facilities.includes(facility.id)}
                                        onChange={() => toggleFacility(facility.id)}
                                    />
                                    <div className="ml-3 flex items-center space-x-2">
                                        {facility.icon && (
                                            <span className="p-1.5 bg-indigo-600 rounded-lg text-white flex items-center justify-center">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {facility.iconSvg}
                                                </svg>
                                            </span>
                                        )}
                                        <span className="text-sm font-medium text-gray-700">{facility.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    {/* Footer Action */}
                    <div className="p-6 pb-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700  font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Submit'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}