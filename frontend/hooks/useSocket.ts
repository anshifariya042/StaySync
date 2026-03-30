import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/useAuthStore';

export const useSocket = () => {
    const { user } = useAuthStore();

    useEffect(() => {
        const userId = user?.id || (user as any)?._id;
        if (userId) {
            // Only connect if user is logged in
            if (!socket.connected) {
                socket.connect();
            }

            socket.emit('join', userId);

            return () => {
                socket.emit('leave', userId);
            };
        } else {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [user]);

    return socket;
};
