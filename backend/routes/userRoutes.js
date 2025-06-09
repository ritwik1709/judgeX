import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, getUserStats } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
// import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Admin-only routes
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin', getAllUsers);
router.patch('/admin/:id', updateUserRole);
router.delete('/admin/:id', deleteUser);

// User routes (only require authentication)
router.get('/stats', authMiddleware, getUserStats);

export default router; 