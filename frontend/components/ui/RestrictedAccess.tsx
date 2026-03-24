"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface RestrictedAccessProps {
    status: 'pending' | 'rejected' | string;
    name?: string;
}

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function RestrictedAccess({ status, name }: RestrictedAccessProps) {
    const router = useRouter()
    const isRejected = status === 'rejected'

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center antialiased">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-[#4F7C82]/10 border border-white relative overflow-hidden"
            >
                <div className={`size-24 rounded-3xl flex items-center justify-center mx-auto mb-10 ${isRejected ? 'bg-red-50 text-red-500' : 'bg-[#B8E3E9]/20 text-[#4F7C82]'}`}>
                    <Icon name={isRejected ? 'error_outline' : 'pending_actions'} className="text-5xl" />
                </div>
                
                <h2 className="text-3xl font-black text-[#0B2E33] tracking-tighter mb-4">
                    {isRejected ? 'Application Rejected' : 'Awaiting Approval'}
                </h2>
                
                <p className="text-[#4F7C82] font-bold tracking-tight mb-10 leading-relaxed">
                    {isRejected 
                        ? `Hello ${name || 'User'}, we regret to inform you that your booking request has been rejected. Please contact the administrator for further details.`
                        : `Hello ${name || 'User'}, your booking request is currently being reviewed by our administrative team. Once approved, you'll gain full access to your residence dashboard.`
                    }
                </p>

                <div className="space-y-4">
                    {!isRejected && (
                        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-dashed border-[#B8E3E9] mb-8">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F7C82] opacity-60">Status: Pending Verification</p>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => router.push('/')}
                        className="w-full py-5 bg-[#0B2E33] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#0B2E33]/20 hover:bg-[#4F7C82] transition-all active:scale-95"
                    >
                        Return to Home
                    </button>
                    
                    {isRejected && (
                        <button 
                            onClick={() => router.push('/explore-hostels')}
                            className="w-full py-5 bg-white text-[#4F7C82] border border-[#B8E3E9] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Explore Alternatives
                        </button>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-10 -bottom-10 size-40 bg-[#B8E3E9]/10 rounded-full blur-3xl"></div>
            </motion.div>
        </div>
    )
}
