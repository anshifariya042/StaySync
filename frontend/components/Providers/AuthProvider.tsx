'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useSocket } from '@/hooks/useSocket';
import { useRouter, usePathname } from 'next/navigation';
import NotificationToast from '@/components/ui/NotificationToast';
import { socket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, loading, checkAuth } = useAuthStore();
    const fetchProfile = useUserStore((state) => state.fetchProfile);
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    
    // Notification state
    const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: string }>({
        show: false,
        title: '',
        message: '',
        type: ''
    });

    // Initialize Socket Connection
    useSocket();

    useEffect(() => {
        const init = async () => {
             await checkAuth();
             fetchProfile();
        }
        init();
    }, [checkAuth, fetchProfile]);

    // PROTECTED ROUTES CHECK & SOCKET LISTENERS
    useEffect(() => {
        if (!loading) {
            const isProtectedRoute = pathname?.startsWith('/user') || 
                                     pathname?.startsWith('/admin') || 
                                     pathname?.startsWith('/staff') || 
                                     pathname?.startsWith('/superadmin') || 
                                     pathname?.startsWith('/hostel');
                                     
            if (isProtectedRoute && !user) {
                console.log("Unauthorized access to protected route, redirecting to login...");
                router.push('/login');
            }
        }

        // Listen for notifications
        const handleStatusUpdate = (data: any) => {
            setNotification({
                show: true,
                title: data.status === 'approved' ? 'Application Approved' : 'Application Update',
                message: data.message,
                type: data.status
            });
            // Re-fetch profile to sync state
            fetchProfile();
            // Invalidate notifications list to show real-time
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }

        socket.on('booking-status-updated', handleStatusUpdate);

        return () => {
            socket.off('booking-status-updated', handleStatusUpdate);
        };
    }, [user, loading, pathname, router, fetchProfile]);

    return (
        <>
            {children}
            <NotificationToast 
                show={notification.show}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />
        </>
    );
}
