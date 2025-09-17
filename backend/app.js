import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import requireAuth from "./middleware/requireAuth.js";
import passwordRoutes from "./routes/passwordRoutes.js";

const app = express();

// Connect to database
connectDB();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: "This is a protected route!", user: req.user });
});

// Routes
app.use("/api/passwords", passwordRoutes);
// No need for userRoutes when using Clerk

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// // 404 handler - Fixed the wildcard route syntax
// app.all("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

export default app;

