import express from "express";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All notification routes require a user to be logged in.
router.use(protect);

// Get all notifications for the logged-in user
router.get("/", getMyNotifications);

// Mark a specific notification as read
router.patch("/:id/read", markAsRead);

export default router;
