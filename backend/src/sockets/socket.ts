import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5174", "http://localhost:3000", "http://localhost:5173", "http://localhost:3001"],
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
        io.to(userId).emit(event, data);
    }
};
