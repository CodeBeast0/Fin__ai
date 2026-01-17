import { verifyToken } from "../config/jwt.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.fley_auth_token || req.cookies.token;
        console.log("Token received:", token ? "Yes" : "No");

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = verifyToken(token);
        console.log("Decoded Token ID:", decoded.id);

        req.user = await User.findById(decoded.id).select("-password");
        console.log("User found in DB:", req.user ? "Yes" : "No");

        if (!req.user) {
            console.log("User not found for ID:", decoded.id);
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
