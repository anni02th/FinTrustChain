import mongoose from "mongoose";
import { createNotification } from "../services/notificationService.js";
// LoanBrochure Schema

const loanBrochureSchema = new mongoose.Schema(
  {
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "A loan brochure must specify an amount."],
    },

    interestRate: {
      type: Number,
      required: [true, "A loan brochure must specify an interest rate."],
    },

    tenorDays: {
      type: Number,
      required: [
        true,
        "A loan brochure must specify a repayment tenor in days.",
      ],
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    lenderStats: {
      loansGiven: { type: Number, default: 0 },
      reqAcceptRatio: { type: Number, default: 0 }, // e.g., 0.85 for 85%
      totalLent: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const LoanBrochure = mongoose.model("LoanBrochure", loanBrochureSchema);

export default LoanBrochure;
