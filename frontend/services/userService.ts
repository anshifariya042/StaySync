import api from '../lib/api';

export const getProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

export const updateProfile = async (profileData: { name?: string, email?: string, phone?: string, profileImage?: string }) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
};
