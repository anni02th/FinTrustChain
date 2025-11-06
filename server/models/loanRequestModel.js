import mongoose from "mongoose";
import { createNotification } from "../services/notificationService.js";

const loanRequestSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // max 3
    brochureIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanBrochure",
      },
    ],

    selectedBrochure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanBrochure",
    },

    guarantor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    guarantorStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "GUARANTOR_ACCEPTED",
        "CONTRACTING",
        "CANCELLED",
        "FULFILLED",
      ],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

export default LoanRequest;
