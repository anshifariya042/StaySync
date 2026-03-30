import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;

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

        // Join room by userId for targeted notifications
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`👤 User ${userId} joined room ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("🔌 User disconnected:", socket.id);
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
