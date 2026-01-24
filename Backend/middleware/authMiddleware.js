import { verifyToken } from "../config/jwt.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("[AUTH] No token found in Authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = verifyToken(token);
    console.log(`[AUTH] Verifying Identity for User ID: ${decoded.id}`);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log(`[AUTH] User ID ${decoded.id} not found`);
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    console.log(`[AUTH] Authenticated as: ${req.user.name} (${req.user.email})`);
    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const validateLinkTelegram = (req, res, next) => {
  const { token, telegramUserId } = req.body;
  if (!token || !telegramUserId) {
    return res.status(400).json({
      success: false,
      message: "Missing token or telegramUserId",
    });
  }
  next();
};

export const validateSpend = (req, res, next) => {
  const { telegramUserId, amount, title } = req.body;
  if (!telegramUserId || !amount || !title) {
    return res.status(400).json({
      success: false,
      message: "Missing telegramUserId, amount, or title",
    });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount",
    });
  }
  next();
};

export const validateTelegramIdParam = (req, res, next) => {
  if (!req.params.telegramId) {
    return res.status(400).json({ message: "Missing telegramId parameter" });
  }
  next();
};

export const validateSave = (req, res, next) => {
  const { telegramUserId, amount } = req.body;
  if (!telegramUserId || !amount) {
    return res.status(400).json({
      success: false,
      message: "Missing telegramUserId or amount",
    });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount",
    });
  }
  next();
};
