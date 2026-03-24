import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets/socket";

// Connect MongoDB
connectDB();

// Create HTTP Server (needed for Socket.IO later)
const server = http.createServer(app);

// Init Socket
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
