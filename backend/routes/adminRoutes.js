import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  deleteUser,
  getAllSubmissions,
  deleteSubmission,
  getAdminStats,
} from '../controllers/adminController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';


// Protect all with auth + admin
router.use(authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/submissions', getAllSubmissions);
router.delete('/submissions/:id', deleteSubmission);

// Get admin statistics
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

export default router;
