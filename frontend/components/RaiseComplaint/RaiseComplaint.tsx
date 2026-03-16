// "use client"

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useRouter } from 'next/navigation'
// import { useAuthStore as useAuth } from '@/store/useAuthStore'
// import UserSidebar from '@/components/UserSidebar/UserSidebar'
// import { useSubmitComplaint } from '@/hooks/useUserComplaints'
// import { useProfile } from '@/hooks/useProfile'

// // Helper for Material Symbols
// const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
//     <span className={`material-symbols-outlined ${className}`}>{name}</span>
// )

// export default function RaiseComplaint() {
//     const router = useRouter()
//     const { user, logout } = useAuth()
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const { data: fullUser, isLoading: profileLoading } = useProfile()
//     const submitComplaintMutation = useSubmitComplaint()

//     const [formData, setFormData] = useState({
//         category: '',
//         priority: 'Normal',
//         title: '',
//         description: '',
//         images: [] as File[]
//     })

//     const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
//         }
//     }

//     const handleLogout = () => {
//         logout();
//         router.push('/login');
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!formData.category || !formData.title || !formData.description) {
//             setStatus({ type: 'error', message: 'Please fill in all required fields.' });
//             return;
//         }

//         setStatus(null);

//         try {
//             const data = new FormData();
//             data.append('category', formData.category);
//             data.append('priority', formData.priority);
//             data.append('title', formData.title);
//             data.append('description', formData.description);
//             formData.images.forEach(image => {
//                 data.append('images', image);
//             });
            
//             // Check if user is actually in a hostel
//             if (!fullUser?.hostelId) {
//                 setStatus({ type: 'error', message: 'You must be a resident of a hostel to raise a complaint. Please book a hostel first.' });
//                 return;
//             }

//             // The backend now handles extracting hostelId from the authenticated user
//             await submitComplaintMutation.mutateAsync(data);

//             setStatus({ type: 'success', message: 'Your complaint has been submitted successfully!' });
            
//             setFormData({
//                 category: '',
//                 priority: 'Normal',
//                 title: '',
//                 description: '',
//                 images: []
//             });

//             setTimeout(() => {
//                 router.push('/user/dashboard');
//             }, 2000);

//         } catch (error: any) {
//             console.error("Failed to submit complaint:", error);
//             setStatus({ 
//                 type: 'error', 
//                 message: error.response?.data?.message || error.message || 'Failed to submit complaint. Please try again.' 
//             });
//         }
//     }

//     return (
//         <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
//             <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
//             <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
//             <div className="relative flex h-full w-full overflow-x-hidden">
//                 <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//                 {/* Main Content Area */}
//                 <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
//                     {/* Top Header */}
//                     <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800">
//                         <div className="flex items-center gap-4">
//                             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-400">
//                                 <Icon name="menu" />
//                             </button>
//                             <h2 className="text-lg font-bold">Raise a Complaint</h2>
//                         </div>
                       
//                     </header>

//                     <div className="p-6 max-w-2xl mx-auto w-full">
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Submit a request</h2>
//                             <p className="text-slate-600 dark:text-slate-400 mt-2">Please provide details about your issue and we'll get back to you shortly.</p>
//                         </div>

//                         {status && (
//                             <motion.div 
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
//                             >
//                                 {status.message}
//                             </motion.div>
//                         )}

//                         <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
//                             <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Room Number</label>
//                                     <input 
//                                         className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed px-4 py-3 outline-none" 
//                                         readOnly 
//                                         type="text" 
//                                         value={fullUser?.roomId?.roomNumber ? `Room ${fullUser.roomId.roomNumber} - ${fullUser.roomId.type}` : "No Room Assigned"}
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
//                                         <select 
//                                             name="category"
//                                             value={formData.category}
//                                             onChange={handleChange}
//                                             required
//                                             className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
//                                         >
//                                             <option value="">Select category</option>
//                                             <option value="Maintenance">Maintenance</option>
//                                             <option value="Housekeeping">Housekeeping</option>
//                                             <option value="Plumbing">Plumbing</option>
//                                             <option value="Electrical">Electrical</option>
//                                             <option value="Wifi">Wifi</option>
//                                             <option value="Other">Other</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
//                                         <select 
//                                             name="priority"
//                                             value={formData.priority}
//                                             onChange={handleChange}
//                                             className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
//                                         >
//                                             <option value="Normal">Normal</option>
//                                             <option value="High">High</option>
//                                             <option value="Urgent">Urgent</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Issue Title</label>
//                                     <input 
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400" 
//                                         placeholder="Brief summary of the issue" 
//                                         type="text"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
//                                     <textarea 
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400 resize-none" 
//                                         placeholder="Describe the problem in detail..." 
//                                         rows={4}
//                                     ></textarea>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Evidence Photos</label>
//                                     <input 
//                                         type="file" 
//                                         multiple 
//                                         hidden 
//                                         ref={fileInputRef} 
//                                         onChange={handleFileChange}
//                                         accept="image/*"
//                                     />
//                                     <div 
//                                         onClick={() => fileInputRef.current?.click()}
//                                         className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
//                                     >
//                                         <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform text-primary">
//                                             <Icon name="cloud_upload" />
//                                         </div>
//                                         <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
//                                             {formData.images.length > 0 ? `${formData.images.length} file(s) selected` : "Click to upload or drag and drop"}
//                                         </p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
//                                     </div>
//                                 </div>

//                                 <button 
//                                     disabled={submitComplaintMutation.isPending}
//                                     className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" 
//                                     type="submit"
//                                 >
//                                     {submitComplaintMutation.isPending ? (
//                                         <>
//                                             <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                                             <span>Submitting...</span>
//                                         </>
//                                     ) : (
//                                         "Submit Complaint"
//                                     )}
//                                 </button>
//                             </form>
//                         </div>

//                         <footer className="mt-8 text-center">
//                             <p className="text-sm text-slate-500 dark:text-slate-500">
//                                 Typically responded to within <span className="font-semibold text-slate-700 dark:text-slate-300">2 hours</span>.
//                             </p>
//                         </footer>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }

"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useSubmitComplaint } from '@/hooks/useUserComplaints'
import { useProfile } from '@/hooks/useProfile'

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined align-middle ${className}`}>{name}</span>
)

export default function RaiseComplaint() {
    const router = useRouter()
    const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: fullUser } = useProfile()
    const submitComplaintMutation = useSubmitComplaint()

    const [formData, setFormData] = useState({
        category: '',
        priority: 'Normal',
        title: '',
        description: '',
        images: [] as File[]
    })

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.title || !formData.description) {
            setStatus({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }

        try {
            const data = new FormData();
            data.append('category', formData.category);
            data.append('priority', formData.priority);
            data.append('title', formData.title);
            data.append('description', formData.description);
            formData.images.forEach(image => data.append('images', image));
            
            if (!fullUser?.hostelId) {
                setStatus({ type: 'error', message: 'Resident status required.' });
                return;
            }

            await submitComplaintMutation.mutateAsync(data);
            setStatus({ type: 'success', message: 'Ticket submitted successfully.' });
            setTimeout(() => router.push('/user/dashboard'), 2000);
        } catch (error: any) {
            setStatus({ type: 'error', message: 'Submission failed.' });
        }
    }

    return (
        <div className="bg-[#F9FAFB] font-display text-slate-900 min-h-screen">
            {/* Using the same fonts as your MyHostel page */}
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                <div className="max-w-5xl mx-auto w-full">
                    
                    {/* Header matching your new style */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)} 
                                className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 lg:hidden"
                            >
                                <Icon name="menu" className="text-[#ec5b13]" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Raise Complaint.</h1>
                                <p className="text-slate-400 text-sm font-medium">Something not right? Let us fix it for you.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-[#ec5b13] animate-pulse" />
                           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Room {fullUser?.roomId?.roomNumber || 'N/A'}</span>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                                
                                {/* Heading Input */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#ec5b13] transition-colors">Issue Heading</label>
                                    <input 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleChange}
                                        placeholder="Briefly describe the issue..." 
                                        className="w-full text-1xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-[#ec5b13] outline-none pb-4 transition-all placeholder:text-slate-200"
                                    />
                                </div>

                                {/* Details Area */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-[#ec5b13] transition-colors">Full Details</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="When did this start? Any specific details?" 
                                        className="w-full text-lg font-medium bg-transparent border-b-2 border-slate-100 focus:border-[#ec5b13] outline-none pb-4 transition-all resize-none placeholder:text-slate-200"
                                    />
                                </div>

                                {/* Evidence Attachment */}
                                <div className="pt-2">
                                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 hover:border-[#ec5b13] hover:bg-[#ec5b13]/5 transition-all group"
                                    >
                                        <Icon name="add_a_photo" className="text-slate-400 group-hover:text-[#ec5b13]" />
                                        <span className="text-sm font-bold text-slate-600">
                                            {formData.images.length > 0 ? `${formData.images.length} Photos Selected` : "Upload Evidence Photos"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Category</label>
                                        <select 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#ec5b13]/20"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Wifi">Internet/Wifi</option>
                                            <option value="Plumbing">Plumbing & Water</option>
                                            <option value="Cleaning">Cleaning</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Severity</label>
                                        <select 
                                            name="priority" 
                                            value={formData.priority} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#ec5b13]/20"
                                        >
                                            <option value="Normal">Normal (48h)</option>
                                            <option value="High">High (24h)</option>
                                            <option value="Urgent">Urgent (Now)</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    disabled={submitComplaintMutation.isPending}
                                    className="w-full bg-[#ec5b13] hover:bg-[#d44d0f] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#ec5b13]/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitComplaintMutation.isPending ? "SUBMITTING..." : "SUBMIT COMPLAINT"}
                                </button>
                            </div>

                            {/* Status Notification */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-4 rounded-2xl text-[10px] font-black tracking-widest text-center border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
                                    >
                                        {status.message.toUpperCase()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}