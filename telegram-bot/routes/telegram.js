import express from "express";
import { telegramWebhook } from "../controllers/telegramController.js";

const router = express.Router();

// POST endpoint for Telegram webhook
router.post("/webhook", telegramWebhook);

export default router;
