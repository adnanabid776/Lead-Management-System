import express from "express";
import cors from "cors";
import { dbConnect } from "./config/dbconfig.js";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dbConnect();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "DEVELOPMENT" && { stack: err.stack }),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start Server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server running on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
