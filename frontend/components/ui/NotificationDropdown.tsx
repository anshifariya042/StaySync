"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, CheckCircle2, XCircle, Info } from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    
    const { data: notifications = [], isLoading } = useNotifications()
    const markAsReadMutation = useMarkAsRead()
    const markAllAsReadMutation = useMarkAllAsRead()

    const unreadCount = notifications.filter((n: any) => !n.isRead).length

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAsRead = (id: string, isRead: boolean) => {
        if (!isRead) {
            markAsReadMutation.mutate(id)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />
            case 'error': return <XCircle className="text-rose-500" size={20} />
            case 'warning': return <Info className="text-amber-500" size={20} />
            case 'new_hostel': return <Bell className="text-indigo-500" size={20} />
            default: return <Info className="text-blue-500" size={20} />
        }
    }

    const getBgColor = (type: string, isRead: boolean) => {
        if (isRead) return 'bg-white'
        switch (type) {
            case 'success': return 'bg-emerald-50'
            case 'error': return 'bg-rose-50'
            case 'warning': return 'bg-amber-50'
            case 'new_hostel': return 'bg-indigo-50'
            default: return 'bg-blue-50'
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3.5 text-[#4F7C82] bg-white rounded-2xl border border-slate-100 shadow-sm hover:text-[#0B2E33] transition-all hover:shadow-md active:scale-95"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-3 right-3 flex size-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-3 bg-rose-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-[22rem] bg-white rounded-3xl shadow-2xl border border-slate-100/50 overflow-hidden z-[100] antialiased origin-top-right"
                    >
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-[#0B2E33] tracking-tight">Notifications</h3>
                                <p className="text-[10px] uppercase tracking-widest text-[#4F7C82] font-bold mt-1">
                                    {unreadCount} unread
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsReadMutation.mutate()}
                                    className="text-[10px] font-bold uppercase tracking-widest text-[#0B2E33] hover:text-[#4F7C82] transition-colors flex items-center gap-1.5 bg-slate-200/50 px-3 py-1.5 rounded-full"
                                >
                                    <Check size={12} /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[25rem] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-400">
                                    <div className="size-6 border-2 border-[#4F7C82] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-sm font-medium">Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Bell size={28} />
                                    </div>
                                    <h4 className="text-[#0B2E33] font-bold mb-1">All Caught Up</h4>
                                    <p className="text-[#4F7C82] text-sm">You have no new notifications.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notif: any) => (
                                        <div 
                                            key={notif._id}
                                            onClick={() => handleMarkAsRead(notif._id, notif.isRead)}
                                            className={`p-5 flex gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${getBgColor(notif.type, notif.isRead)}`}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm tracking-tight mb-1 ${notif.isRead ? 'font-semibold text-slate-700' : 'font-black text-[#0B2E33]'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-[#4F7C82] font-medium'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4F7C82]/60 mt-3">
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="shrink-0 size-2 bg-rose-500 rounded-full mt-1.5"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
