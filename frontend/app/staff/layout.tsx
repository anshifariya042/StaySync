"use client";

import StaffSidebar from "@/components/StaffSidebar/StaffSidebar";
import { useUserStore } from "@/store/useUserStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, isLoading } = useUserStore();
    const { isOpen, setIsOpen } = useSidebarStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!profile || profile.role !== "staff")) {
            router.push("/login");
        }
    }, [profile, isLoading, router]);

    if (isLoading || !profile || profile.role !== "staff") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-hidden font-display antialiased">
             <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>
            
            <StaffSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
