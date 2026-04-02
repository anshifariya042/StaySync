import { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '@/lib/socket';
import { getChatHistory, saveChatMessage } from '@/services/chatService';
import { useAuthStore } from '@/store/useAuthStore';

interface Message {
    complaintId: string;
    senderId: any;
    receiverId: any;
    message: string;
    messageId?: string;
    isRead?: boolean;
    timestamp: Date;
}

export const useChat = (complaintId: string, receiverId: string) => {
    const { user } = useAuthStore();
    const userId = user?.id || (user as any)?._id;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch history
    useEffect(() => {
        if (!complaintId || !receiverId) return;

        // Check initial online status
        socket.emit("check-user-status", receiverId);

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const history = await getChatHistory(complaintId);
                if (history.success) {
                    setMessages(history.data);
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Join room
        socket.emit("join-chat", complaintId);

        // Socket listeners
        const handleReceiveMessage = (payload: Message) => {
            if (payload.complaintId === complaintId) {
                setMessages((prev) => [...prev, payload]);
            }
        };

        const handleUserTyping = (data: { complaintId: string, userId: string }) => {
            if (data.complaintId === complaintId && data.userId !== userId) {
                setIsTyping(true);
            }
        };

        const handleUserStopTyping = (data: { complaintId: string, userId: string }) => {
            if (data.complaintId === complaintId && data.userId !== userId) {
                setIsTyping(false);
            }
        };

        const handleStatusChange = (data: { userId: string, status: string }) => {
            if (data.userId === receiverId) {
                setIsOnline(data.status === "online");
            }
        };

        const handleStatusResponse = (data: { userId: string, status: string }) => {
            if (data.userId === receiverId) {
                setIsOnline(data.status === "online");
            }
        };

        const handleMessagesRead = (data: { complaintId: string, userId: string }) => {
            if (data.complaintId === complaintId && data.userId !== userId) {
                // The other person read my messages
                setMessages((prev) => prev.map(msg => ({ ...msg, isRead: true })));
            }
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("user-typing", handleUserTyping);
        socket.on("user-stop-typing", handleUserStopTyping);
        socket.on("user-status-changed", handleStatusChange);
        socket.on("user-status-response", handleStatusResponse);
        socket.on("messages-read", handleMessagesRead);

        // Mark current messages as read initially
        socket.emit("mark-as-read", { complaintId, userId });

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("user-typing", handleUserTyping);
            socket.off("user-stop-typing", handleUserStopTyping);
            socket.off("user-status-changed", handleStatusChange);
            socket.off("user-status-response", handleStatusResponse);
            socket.off("messages-read", handleMessagesRead);
        };
    }, [complaintId, userId, receiverId]);

    // Send mark-as-read whenever new messages arrive that are for me
    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.senderId !== userId && !lastMsg.isRead) {
                socket.emit("mark-as-read", { complaintId, userId });
            }
        }
    }, [messages, complaintId, userId]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || !complaintId || !receiverId) return;

        const messageData = {
            complaintId,
            senderId: userId,
            receiverId,
            message: text,
            timestamp: new Date()
        };

        // UI Optimistic update
        setMessages((prev) => [...prev, messageData]);

        // Emit via socket
        socket.emit("send-message", {
            ...messageData,
            messageId: Date.now().toString()
        });

        // Save to DB
        try {
            await saveChatMessage({
                complaintId,
                senderId: userId,
                receiverId,
                message: text
            });
        } catch (err) {
            console.error("Failed to save message to DB:", err);
        }
    }, [complaintId, receiverId, userId]);

    const handleTyping = useCallback(() => {
        if (!complaintId) return;

        socket.emit("typing", { complaintId, userId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop-typing", { complaintId, userId });
        }, 3000);
    }, [complaintId, userId]);

    return {
        messages,
        isOnline,
        isTyping,
        loading,
        sendMessage,
        handleTyping
    };
};
