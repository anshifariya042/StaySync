import api from '@/lib/api';

export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markNotificationAsRead = async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
};
