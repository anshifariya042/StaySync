"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MoreHorizontal,
    Send,
    User,
    CheckCheck,
    Paperclip,
    Smile,
    Menu,
    MessageSquare,
    ChevronLeft,
    Check
} from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChat } from "@/hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function StaffChat() {
    const { setIsOpen } = useSidebarStore();
    const { user } = useAuthStore();
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: complaints, isLoading } = useQuery({
        queryKey: ['staff-complaints-chat'],
        queryFn: async () => {
            const response = await api.get('/chat/staff/complaints');
            return response.data.data;
        }
    });

    const filteredComplaints = complaints?.filter((c: any) =>
        c.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.roomNumber.includes(searchTerm)
    ) || [];

    return (
        /* Main Container: Switched to slate-50 to match dashboard background */
        <div className="flex-1 flex overflow-hidden bg-[#F8FAFC] h-screen">
            {/* Contacts Sidebar */}
            <div className={`
                ${selectedComplaint ? "hidden md:flex" : "flex"}
                flex-col border-r border-slate-200 bg-white
                w-full md:w-80
            `}>
                <header className="p-5 border-b border-slate-100 flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-slate-500 hover:text-[#0F2D2D] md:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-[#0F2D2D]">Assigned Chats</h2>
                </header>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search residents or IDs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            /* Input style: matches the dashboard search feel */
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#B3E1DD]/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400">Loading chats...</div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No active chats found.</div>
                    ) : (
                        filteredComplaints.map((complaint: any) => (
                            <button
                                key={complaint._id}
                                onClick={() => setSelectedComplaint(complaint)}
                                className={`w-full p-4 flex gap-4 transition-all border-b border-slate-50 ${
                                    selectedComplaint?._id === complaint._id
                                    ? "bg-[#E6F4F2] border-l-4 border-l-[#0F2D2D]" 
                                    : "hover:bg-slate-50"
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-[#B3E1DD]/30 flex items-center justify-center text-[#0F2D2D]">
                                        {complaint.userId?.profileImage ? (
                                            <img src={complaint.userId.profileImage} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-bold text-[#0F2D2D] truncate text-sm">{complaint.userId?.name}</h3>
                                        <span className="text-[10px] text-slate-400 font-bold">#{complaint.complaintId}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{complaint.title}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] font-bold text-[#0F2D2D]/60 uppercase tracking-wider">Room {complaint.roomNumber}</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            complaint.priority === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex-col bg-[#F8FAFC] relative ${selectedComplaint ? "flex" : "hidden md:flex"}`}>
                {selectedComplaint ? (
                    <ChatMessageArea
                        complaint={selectedComplaint}
                        onBack={() => setSelectedComplaint(null)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                            <MessageSquare className="w-10 h-10 text-[#B3E1DD]" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-[#0F2D2D] text-lg">Staff Workspace</h3>
                            <p className="text-sm">Select a resident complaint to start assisting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const ChatMessageArea = ({ complaint, onBack }: { complaint: any, onBack: () => void }) => {
    const { user } = useAuthStore();
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, isOnline, isTyping, sendMessage, handleTyping } = useChat(
        complaint._id,
        complaint.userId?._id || complaint.userId
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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
        <>
            <header className="p-4 bg-white border-b border-slate-200 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-500 hover:text-[#0F2D2D] md:hidden transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-[#B3E1DD]/30 flex items-center justify-center text-[#0F2D2D]">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#0F2D2D] text-sm flex items-center gap-2">
                            {complaint.userId?.name}
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Room {complaint.roomNumber} • {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] hidden sm:block px-3 py-1 rounded-full font-bold uppercase bg-[#E6F4F2] text-[#0F2D2D] border border-[#B3E1DD]">
                        {complaint.status}
                    </span>
                </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#F8FAFC]">
                <div className="flex justify-center mb-8">
                    <span className="px-4 py-1.5 rounded-full bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm border border-slate-100">
                        Conversation Started
                    </span>
                </div>

                {messages.map((msg: any, idx: number) => {
                    const msgSenderId = typeof msg.senderId === 'string' ? msg.senderId : (msg.senderId?._id || msg.senderId?.id);
                    const currentUserId = user?.id || (user as any)?._id;
                    const isMe = msgSenderId && currentUserId && String(msgSenderId) === String(currentUserId);

                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[75%] p-3 px-4 rounded-2xl shadow-sm relative ${isMe
                                ? 'bg-[#0F2D2D] text-white rounded-tr-none' // Dark Teal for staff messages
                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                }`}>
                                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1`}>
                                    <span className={`text-[9px] font-bold ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        <div className="flex">
                                            {msg.isRead ? (
                                                <CheckCheck size={14} className="text-[#B3E1DD]" />
                                            ) : (
                                                <Check size={14} className="text-slate-400" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 border border-slate-100">
                            <div className="w-1.5 h-1.5 bg-[#B3E1DD] rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-[#B3E1DD] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#B3E1DD] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-[24px] border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#B3E1DD]/50 transition-all">
                    <button className="p-2 text-slate-400 hover:text-[#0F2D2D] transition-colors hidden sm:block">
                        <Smile className="w-6 h-6" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-[#0F2D2D] transition-colors hidden sm:block">
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            handleTyping();
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 text-slate-900"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="p-3 bg-[#0F2D2D] text-white rounded-xl shadow-md hover:bg-[#1a4040] transition-all disabled:opacity-30 disabled:shadow-none"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};