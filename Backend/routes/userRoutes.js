import express from 'express';
import { registerUser, login, logoutUser, updateOnboarding } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logoutUser);
router.put('/onboarding', protect, updateOnboarding);

export default router;
