import express from 'express';
import { register, login, getUserInteractions } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/interactions', verifyToken, getUserInteractions);

export default router;
