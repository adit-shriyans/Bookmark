import { Router } from 'express';
const router = Router();
import { getAllUsers, updateUserRole } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

// All user routes require authentication and admin access
router.use(authenticateToken);

// Get all users
router.get('/', getAllUsers);

// Update user role
router.put('/:id/role', updateUserRole);

export { router as default }; 