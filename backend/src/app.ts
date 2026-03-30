import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import hostelRoutes from "./routes/hostelRoutes"
import adminRoutes from "./routes/adminRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import staffRoutes from "./routes/staffRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import superadminRoutes from "./routes/superadminRoutes";




const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:3000", ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/superadmin", superadminRoutes);




// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 StaySync API Running");
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler caught:", err);
  res.status(500).json({ message: err.message || "Internal Server Error", error: err });
});

export default app;
