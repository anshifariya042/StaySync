import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import hostelRoutes from "./routes/hostelRoutes"
import adminRoutes from "./routes/adminRoutes";


const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/admin", adminRoutes);



// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 StaySync API Running");
});

export default app;
