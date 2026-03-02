import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

// Connect MongoDB
connectDB();

// Create HTTP Server (needed for Socket.IO later)
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
