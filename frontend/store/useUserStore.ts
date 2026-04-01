import { create } from 'zustand'
import api from '@/lib/api'

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    profileImage?: string;
    hostelId?: any;
    roomId?: any;
    roomType?: string;
    status?: string;
    createdAt?: string;
}

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    clearProfile: () => void;
    updateProfile: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    profile: null,
    isLoading: true,
    error: null,

    fetchProfile: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
            set({ isLoading: false });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/user/profile');
            set({ profile: response.data, isLoading: false });
        } catch (error: any) {
            console.error("Failed to fetch user profile:", error);
            set({ 
                error: error.response?.data?.message || "Failed to load profile", 
                isLoading: false 
            });
        }
    },

    clearProfile: () => set({ profile: null, error: null }),
    
    updateProfile: (data) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null
    }))
}))
