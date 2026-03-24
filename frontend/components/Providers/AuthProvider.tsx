'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useSocket } from '@/hooks/useSocket';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, loading, checkAuth } = useAuthStore();
    const fetchProfile = useUserStore((state) => state.fetchProfile);
    const router = useRouter();
    const pathname = usePathname();
    
    // Initialize Socket Connection
    useSocket();

    useEffect(() => {
        const init = async () => {
             await checkAuth();
             fetchProfile();
        }
        init();
    }, [checkAuth, fetchProfile]);

    // PROTECTED ROUTES CHECK
    useEffect(() => {
        if (!loading) {
            const isProtectedRoute = pathname?.startsWith('/user') || 
                                     pathname?.startsWith('/admin') || 
                                     pathname?.startsWith('/staff') || 
                                     pathname?.startsWith('/hostel');
                                     
            if (isProtectedRoute && !user) {
                console.log("Unauthorized access to protected route, redirecting to login...");
                router.push('/login');
            }
        }
    }, [user, loading, pathname, router]);

    return <>{children}</>;
}
