import express from "express";
import {
  getMyLoanRequests,
  acceptLoanRequest,
} from "../controllers/lenderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
// All routes below are restricted to users currently in the 'LENDER' role.
router.use(restrictTo("LENDER"));
// GET /api/v1/lender/requests
router.get("/requests", getMyLoanRequests);

// POST /api/v1/lender/requests/:id/accept
router.post("/requests/:id/accept", acceptLoanRequest);

export default router;
