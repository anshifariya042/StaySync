'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    hostelId?: any;
    roomId?: any;
    status?: string;
    profileImage?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<User>;
    register: (data: any) => Promise<User>;
    googleLogin: (token: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await api.get('/user/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (formData: any) => {
        try {
            const response = await api.post('/auth/login', formData);
            setUser(response.data.user);
            // Tokens are handled by cookies or stored locally if accessToken is returned
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }
            return response.data.user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (formData: any) => {
        try {
            const response = await api.post('/auth/register', formData);
            const userData = response.data.user;
            setUser(userData);
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const googleLogin = async (idToken: string) => {
        try {
            const response = await api.post('/auth/google-login', { token: idToken });
            setUser(response.data.user);
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }
            return response.data.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        // Clear cookies or hit logout endpoint if needed
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
