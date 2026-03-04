import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import hostelRoutes from "./routes/hostelRoutes"


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hostels", hostelRoutes);



// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 StaySync API Running");
});

export default app;
