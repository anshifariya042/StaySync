'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const fetchProfile = useUserStore((state) => state.fetchProfile);

    useEffect(() => {
        checkAuth();
        fetchProfile();
    }, [checkAuth, fetchProfile]);

    return <>{children}</>;
}
