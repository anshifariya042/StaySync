"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, CheckCheck, Check } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useChat } from '@/hooks/useChat';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const FloatingChatWidget = () => {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

    // Only residents (user role) can see the floating chat widget
    if (user?.role !== 'user') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <ChatPanel
                    selectedComplaint={selectedComplaint}
                    setSelectedComplaint={setSelectedComplaint}
                    onClose={() => setIsOpen(false)}
                />
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group relative mb-2"
                id="floating-chat-button"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    NEW
                </span>
            </button>
        </div>
    );
};

interface ChatPanelProps {
    selectedComplaint: any;
    setSelectedComplaint: (c: any) => void;
    onClose: () => void;
}

const ChatPanel = ({ selectedComplaint, setSelectedComplaint, onClose }: ChatPanelProps) => {
    const { user } = useAuthStore();
    const [showComplaintSelector, setShowComplaintSelector] = useState(!selectedComplaint);

    const { data: complaints, isLoading } = useQuery({
        queryKey: ['user-complaints-chat'],
        queryFn: async () => {
            const response = await api.get('/user/complaints');
            return response.data.data;
        }
    });

    const activeComplaints = complaints?.filter((c: any) => c.status !== 'Resolved') || [];

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 w-[380px] h-[550px] mb-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center animate-in slide-in-from-bottom-5 duration-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (activeComplaints.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 w-[380px] h-[200px] mb-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-5 duration-300">
                <p className="text-slate-500 dark:text-slate-400 font-medium">You have no active complaints.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Chat will be available once you raise a complaint.</p>
            </div>
        );
    }

    // Auto-select first complaint if only one exists and none selected
    if (activeComplaints.length === 1 && !selectedComplaint) {
        setSelectedComplaint(activeComplaints[0]);
        setShowComplaintSelector(false);
    }

    if (showComplaintSelector) {
        return (
            <div className="bg-white dark:bg-slate-900 w-[380px] h-[550px] mb-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
                <div className="p-4 bg-primary text-white flex justify-between items-center">
                    <h3 className="font-semibold">Select a Chat</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeComplaints.map((c: any) => (
                        <button
                            key={c._id}
                            onClick={() => {
                                setSelectedComplaint(c);
                                setShowComplaintSelector(false);
                            }}
                            className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-slate-800 dark:text-white line-clamp-1">{c.title}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {c.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">ID: {c.complaintId}</p>
                            {c.assignedStaff ? (
                                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                    <User size={12} /> Assigned to {c.assignedStaff.name}
                                </p>
                            ) : (
                                <p className="text-xs text-slate-400 mt-2 italic">Awaiting staff assignment...</p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <ChatInterface
            complaint={selectedComplaint}
            onBack={() => setShowComplaintSelector(true)}
            onClose={onClose}
        />
    );
};

const ChatInterface = ({ complaint, onBack, onClose }: { complaint: any, onBack: () => void, onClose: () => void }) => {
    const { user } = useAuthStore();
    const [inputValue, setInputValue] = useState("");
    const isStaffAssigned = !!complaint.assignedStaff;

    const { messages, isOnline, isTyping, sendMessage, handleTyping } = useChat(
        complaint._id,
        complaint.assignedStaff?._id || ""
    );

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 w-[380px] h-[550px] mb-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button onClick={onBack} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ChevronDown className="rotate-90 text-slate-500" size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-white truncate flex items-center gap-2">
                        {isStaffAssigned ? complaint.assignedStaff.name : "System"}
                        {isStaffAssigned && (
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></span>
                        )}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {isStaffAssigned ? `${complaint.assignedStaff.role} • ${isOnline ? 'Online' : 'Offline'}` : "Complaint assignment pending"}
                    </p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="text-slate-500" size={20} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                {!isStaffAssigned ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/20">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3 text-amber-600">
                            <User size={24} />
                        </div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Assigning Staff</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-500/80">Your complaint is being assigned. Chat will be available shortly.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                                Complaint Raised
                            </span>
                        </div>

                        {messages.map((msg: any, idx: number) => {
                            const senderId = typeof msg.senderId === 'string' ? msg.senderId : (msg.senderId?._id || msg.senderId?.id);
                            const currentUserId = user?.id || (user as any)?._id;
                            const isMe = senderId && currentUserId && String(senderId) === String(currentUserId);

                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[80%] p-3 px-4 rounded-2xl shadow-sm relative ${isMe
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className={`text-[9px] ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <div className="flex">
                                                    {msg.isRead ? (
                                                        <CheckCheck size={14} className="text-blue-400" />
                                                    ) : (
                                                        <Check size={14} className="text-slate-300" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Input */}
            {isStaffAssigned && (
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 px-3 focus-within:ring-2 ring-primary/20 transition-all">
                        <textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                handleTyping();
                            }}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 text-slate-800 dark:text-white"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="mb-1 p-2 bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-xl transition-colors shadow-lg shadow-primary/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingChatWidget;
