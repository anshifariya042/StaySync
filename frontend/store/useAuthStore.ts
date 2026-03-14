import { create } from 'zustand';
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

interface AuthState {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<User>;
    register: (data: any) => Promise<User>;
    googleLogin: (token: string) => Promise<User>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    checkAuth: async () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await api.get('/user/profile');
                    set({ user: response.data, loading: false });
                    return;
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    localStorage.removeItem('accessToken');
                }
            }
        }
        set({ loading: false });
    },

    login: async (formData: any) => {
        const response = await api.post('/auth/login', formData);
        set({ user: response.data.user });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data.user;
    },

    register: async (formData: any) => {
        const response = await api.post('/auth/register', formData);
        set({ user: response.data.user });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data.user;
    },

    googleLogin: async (idToken: string) => {
        const response = await api.post('/auth/google-login', { token: idToken });
        set({ user: response.data.user });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data.user;
    },

    logout: () => {
        set({ user: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    }
}));
