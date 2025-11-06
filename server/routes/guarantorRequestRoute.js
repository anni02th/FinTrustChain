import express from "express";
import {
  createGuarantorRequest,
  respondToGuarantorRequest,
} from "../controllers/guarantorRequestController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Send a new guarantor request
router.post("/", createGuarantorRequest);

// Respond to a guarantor request
// The :id is the ID of the GuarantorRequest document
router.patch("/:id", respondToGuarantorRequest);

export default router;
