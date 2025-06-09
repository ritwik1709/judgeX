import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import compilerRoutes from "./routes/compiler.js";
import connectDB from "./config/db.js";
import mongoose from 'mongoose';
import { EnhancedStorageService } from './services/enhanced-storage-service.js';

connectDB(); //  Call before routes

const app = express();

// Initialize enhanced storage service
const storageService = new EnhancedStorageService();
await storageService.initialize();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", compilerRoutes);

// Make storage service available to routes
app.locals.storageService = storageService;

// Add storage stats endpoint
app.get('/api/storage/stats', async (req, res) => {
  try {
    const stats = await storageService.getJobStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting storage stats:', error);
    res.status(500).json({ error: 'Failed to get storage stats' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
