import LoanRequest from "../models/loanRequestModel.js";
import LoanBrochure from "../models/loanBrochureModel.js";
import * as trustIndexService from "../services/trustIndexService.js";

export const createLoanRequest = async (req, res, next) => {
  try {
    const receiver = req.user;
    const { brochureIds } = req.body;

    // --- 1. Validation ---
    if (receiver.currentRole !== "RECEIVER") {
      throw new Error("You must be in the RECEIVER role to request a loan.");
    }
    if (!brochureIds || brochureIds.length === 0 || brochureIds.length > 3) {
      throw new Error(
        "You must select between 1 and 3 brochures to apply for."
      );
    }

    // Check for existing active loan requests
    const existingActiveRequest = await LoanRequest.findOne({
      receiver: receiver.id,
      status: { $in: ["PENDING", "GUARANTOR_ACCEPTED", "CONTRACTING"] },
    });
    if (existingActiveRequest) {
      throw new Error("You already have an active loan request.");
    }

    // --- 2. Brochure and Eligibility Validation ---
    const brochures = await LoanBrochure.find({
      _id: { $in: brochureIds },
      active: true,
    });
    if (brochures.length !== brochureIds.length) {
      throw new Error(
        "One or more of the selected brochures are invalid or no longer active."
      );
    }

    const maxLoan = trustIndexService.getMaxLoanLimit(receiver.trustIndex);
    for (const brochure of brochures) {
      if (brochure.amount > maxLoan) {
        throw new Error(
          `Your TrustIndex of ${receiver.trustIndex} makes you ineligible for a loan of amount ${brochure.amount}. Your maximum eligible amount is ${maxLoan}.`
        );
      }
    }

    // --- 3. Create the Loan Request ---
    const newLoanRequest = await LoanRequest.create({
      receiver: receiver.id,
      brochureIds,
    });

    res.status(201).json({
      status: "success",
      message:
        "Loan request created successfully. You may now send a guarantor request for this loan.",
      data: {
        loanRequest: newLoanRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};
