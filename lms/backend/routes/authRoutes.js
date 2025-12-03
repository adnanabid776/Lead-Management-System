import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Admin registers new users
// TEMPORARY: allow creating first admin without auth
// router.post("/register", registerUser);

//router.post("/register", protect, authorizeRoles("admin"), registerUser);

// public login
router.post("/login", loginUser);

// Get current user (protected)
router.get("/me", protect, getMe);

export default router;
