import express from "express";
import { createLoanRequest } from "../controllers/loanRequestController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require a user to be logged in.
router.use(protect);

// POST /api/v1/loan-requests
// Only users in the 'RECEIVER' role can create requests.

router.use(restrictTo("RECEIVER"));
router.post("/", createLoanRequest);

export default router;
