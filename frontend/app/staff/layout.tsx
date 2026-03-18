"use client";

import StaffSidebar from "@/components/StaffSidebar/StaffSidebar";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";


export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, isLoading } = useUserStore();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && (!profile || profile.role !== "staff")) {
            router.push("/login");
        }
    }, [profile, isLoading, router]);

    if (isLoading || !profile || profile.role !== "staff") {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <StaffSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { 
                            onMenuClick: () => setSidebarOpen(true) 
                        } as any);
                    }
                    return child;
                })}
            </div>

        </div>
    );
}


