'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
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
        // Optionally check if user is already logged in (e.g. by hitting a profile endpoint)
        // For now we'll just set loading to false.
        setLoading(false);
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
            const userData = response.data.user || response.data;
            setUser(userData);
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
