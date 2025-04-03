import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

export { router as default }; 