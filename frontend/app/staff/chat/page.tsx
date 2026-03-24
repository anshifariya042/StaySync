"use client";

import React, { useState } from "react";
import { 
    Search, 
    MoreHorizontal, 
    Send, 
    User, 
    CheckCheck, 
    Image as ImageIcon,
    Paperclip,
    Smile,
    Menu,
    MessageSquare
} from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";

const contacts = [
    { id: 1, name: "Rahul Sharma", lastMsg: "Room 102 plumbing issue resolved?", time: "10:30 AM", unread: 2, online: true, room: "102" },
    { id: 2, name: "Ananya Iyer", lastMsg: "Thank you for fixing the light!", time: "9:45 AM", unread: 0, online: false, room: "204" },
    { id: 3, name: "Kevin Varghese", lastMsg: "When will the Wi-Fi be back?", time: "Yesterday", unread: 0, online: true, room: "305" },
    { id: 4, name: "Sara Khan", lastMsg: "My door key is stuck.", time: "Yesterday", unread: 0, online: false, room: "112" },
];

export default function StaffChat() {
    const { setIsOpen } = useSidebarStore();
    const [selectedContact, setSelectedContact] = useState(contacts[0]);

    return (
        <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950 h-screen">
            {/* Contacts Sidebar */}
            <div className={`
                flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
                w-full md:w-80 flex
            `}>
                <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-slate-500 hover:text-blue-600 md:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
                </header>
                
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search residents..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`w-full p-4 flex gap-4 transition-colors ${
                                selectedContact.id === contact.id 
                                    ? "bg-blue-50 dark:bg-blue-900/10" 
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <User className="text-slate-400" />
                                </div>
                                {contact.online && (
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold">{contact.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
                                    {contact.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">Room {contact.room}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 relative">
                {selectedContact ? (
                    <>
                        <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <User className="text-slate-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{selectedContact.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${selectedContact.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                        {selectedContact.online ? 'Online' : 'Offline'} • Room {selectedContact.room}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Dummy Messages */}
                            <div className="flex justify-center">
                                <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today</span>
                            </div>

                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">Hello, is the maintenance staff available? I have a water leakage in my room.</p>
                                    <span className="text-[9px] font-bold text-slate-400 mt-2 block text-right">09:15 AM</span>
                                </div>
                            </div>

                            <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                                <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-600/10 text-white">
                                    <p className="text-sm leading-relaxed">Yes, I'll send someone right away to Room {selectedContact.room}. Should be there in 10 mins.</p>
                                    <div className="flex items-center justify-end gap-1 mt-2">
                                        <span className="text-[9px] font-bold text-blue-100">09:18 AM</span>
                                        <CheckCheck className="w-3 h-3 text-blue-200" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">Perfect, thank you! I'll be waiting.</p>
                                    <span className="text-[9px] font-bold text-slate-400 mt-2 block text-right">09:20 AM</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 dark:text-white"
                                />
                                <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Select a chat</h3>
                            <p className="text-xs">Select a resident to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
