import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/useAuthStore';

export const useSocket = () => {
    const { user } = useAuthStore();

    useEffect(() => {
        if (user && user.id) {
            // Only connect if user is logged in
            if (!socket.connected) {
                socket.connect();
            }

            // Join the user's personal room
            socket.emit('join', user.id);

            // Set up common listeners
            socket.on('booking-status-updated', (data) => {
                console.log('Booking Update:', data);
                // In production, we would use a toast notification here
                alert(`StaySync Update: ${data.message}`);
                
                // Reload profile to reflect status changes
                window.location.reload();
            });

            return () => {
                socket.off('booking-status-updated');
                socket.emit('leave', user.id);
            };
        } else {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [user]);

    return socket;
};
