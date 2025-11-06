import express from "express";
import * as authController from "../controllers/authController.js";
import { authLimiter, uploadLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// User registration route (with rate limiting)
router.post(
  "/register",
  authLimiter,
  uploadLimiter,
  authController.uploadEsign,
  authController.registerUser
);

// Email verification route
router.get("/verify-email/:token", authController.verifyEmail);

// Login route (with stricter rate limiting)
router.post("/login", authLimiter, authController.loginUser);

export default router;
