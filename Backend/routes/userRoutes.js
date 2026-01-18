import { registerUser, login, logoutUser, updateOnboarding, generateFinancialPlan, getUserProfile, telegramLink, Spend, getUserByTelegramId, generateTelegramToken } from '../controllers/userController.js';
import { protect, validateLinkTelegram, validateSpend, validateTelegramIdParam } from '../middleware/authMiddleware.js';
import express from "express";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logoutUser);
router.put('/onboarding', protect, updateOnboarding);
router.get('/AiPlan', protect, generateFinancialPlan);
router.get('/me', protect, getUserProfile);
router.post("/link-telegram", validateLinkTelegram, telegramLink);
router.post("/spend", validateSpend, Spend);
router.get("/by-telegram/:telegramId", validateTelegramIdParam, getUserByTelegramId);
router.post("/generate-telegram-token", protect, generateTelegramToken);

export default router;
