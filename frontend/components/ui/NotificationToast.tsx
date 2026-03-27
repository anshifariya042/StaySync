"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle } from 'lucide-react'

interface NotificationToastProps {
    show: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'approved' | 'rejected' | string;
}

export default function NotificationToast({ show, onClose, title, message, type }: NotificationToastProps) {
    const isApproved = type === 'approved'

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    className="fixed bottom-10 right-10 z-[100] max-w-sm w-full bg-white rounded-[2.5rem] shadow-2xl shadow-[#0B2E33]/20 border border-[#B8E3E9]/30 p-8 flex items-start gap-6 overflow-hidden antialiased"
                >
                    {/* Decorative Background */}
                    <div className={`absolute top-0 right-0 size-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 ${isApproved ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    
                    <div className={`shrink-0 size-14 rounded-2xl flex items-center justify-center ${isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {isApproved ? <CheckCircle size={32} /> : <XCircle size={32} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-[#0B2E33] uppercase tracking-[0.1em] mb-1">{title}</h4>
                        <p className="text-[#4F7C82] text-xs font-bold leading-relaxed pr-6">{message}</p>
                        
                        <div className="mt-4">
                            <button 
                                onClick={onClose}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B2E33] hover:text-[#4F7C82] transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
