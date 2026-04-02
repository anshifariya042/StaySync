import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5174", "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // Join personal room for targeted notification
        socket.on("join", (userId) => {
            socket.join(userId);
            onlineUsers.set(userId, socket.id);
            console.log(`👤 User ${userId} joined personal room ${userId}`);
            
            // Broadcast online status
            socket.broadcast.emit("user-status-changed", { userId, status: "online" });
        });

        // Check user status
        socket.on("check-user-status", (userId) => {
            const isOnline = onlineUsers.has(userId);
            socket.emit("user-status-response", { userId, status: isOnline ? "online" : "offline" });
        });

        // Join chat room based on complaintId
        socket.on("join-chat", (complaintId) => {
            socket.join(complaintId);
            console.log(`💬 User joined chat room: ${complaintId}`);
        });

        // Handle sending messages
        socket.on("send-message", (payload) => {
            const { complaintId, senderId, receiverId, message, messageId, timestamp } = payload;
            
            // Broadcast the message to all members in the complaint room
            // io.to(complaintId).emit("receive-message", {
            //     complaintId,
            //     senderId,
            //     receiverId,
            //     message,
            //     messageId,
            //     timestamp
            // });

            // More controlled emission - ensuring it's sent to the other party
            socket.to(complaintId).emit("receive-message", {
                complaintId,
                senderId,
                receiverId,
                message,
                messageId,
                timestamp
            });

            console.log(`📩 Message from ${senderId} to ${receiverId} in room ${complaintId}: ${message}`);
        });

        // Mark messages as read
        socket.on("mark-as-read", async ({ complaintId, userId }) => {
            try {
                const { ChatMessage } = await import("../models/ChatMessage");
                await ChatMessage.updateMany(
                    { complaintId, receiverId: userId, isRead: false },
                    { $set: { isRead: true } }
                );
                io?.to(complaintId).emit("messages-read", { complaintId, userId });
                console.log(`📖 Messages in ${complaintId} marked as read by ${userId}`);
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });

        // Typing indication
        socket.on("typing", ({ complaintId, userId }) => {
            socket.to(complaintId).emit("user-typing", { complaintId, userId });
        });

        socket.on("stop-typing", ({ complaintId, userId }) => {
            socket.to(complaintId).emit("user-stop-typing", { complaintId, userId });
        });

        socket.on("disconnect", () => {
            console.log("🔌 User disconnected:", socket.id);
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    socket.broadcast.emit("user-status-changed", { userId, status: "offline" });
                    console.log(`👤 User ${userId} went offline`);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const sendNotification = (userId: string, event: string, data: any) => {
    if (io) {
        console.log(`📠 Socket Emitting [${event}] to User [${userId}]:`, data);
        io.to(userId.toString()).emit(event, data);
    } else {
        console.warn(`⚠️ Socket.io not initialized. Could not emit [${event}]`);
    }
};
