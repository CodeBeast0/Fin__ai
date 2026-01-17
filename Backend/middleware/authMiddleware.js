import { verifyToken } from "../config/jwt.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // Log all incoming auth signals for debugging
        console.log(`[AUTH-AUDIT] Header Auth: ${req.headers.authorization ? 'PRESENT' : 'MISSING'}`);

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

        if (req.user) {
            console.log(`[AUTH] Authenticated as: ${req.user.name} (${req.user.email})`);
        } else {
            console.log(`[AUTH] User ID ${decoded.id} not found in database`);
        }

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
