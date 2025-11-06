import * as paymentService from "../services/paymentService.js";
import { settleSuccessfulRepayment } from "../services/loanSettlementServices.js";
import { phonepeClient } from "../services/paymentService.js";
import Contract from "../models/contractModel.js";

// POST /payments/pay
export const createPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const { contractId } = req.body;
    if (!contractId) {
      throw new Error("Contract ID is required to initiate a payment.");
    }
    const contract = await Contract.findById(contractId);

    if (!contract) {
      throw new Error("Contract not found.");
    }
    // Ensure only the receiver can pay and only when the loan is active.
    if (!contract.receiver.equals(user._id)) {
      throw new Error(
        "You are not authorized to make payments for this contract."
      );
    }
    if (contract.status !== "ACTIVE") {
      throw new Error("Payments can only be made on active loans.");
    }

    const redirectUrl = await paymentService.initiatePayment(contractId, user);
    res.status(200).json({
      status: "success",
      message: "Payment initiated successfully.",
      data: {
        redirectUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /payments/callback
// Only for admin use; not exposed to users directly.
export const handleCallback = async (req, res, next) => {
  try {
    let callbackResponse;

    // --- START: DEVELOPMENT-ONLY BYPASS ---
    // IMPORTANT: This block allows you to test with Postman by skipping validation.
    // This MUST be removed or disabled in production.
    if (process.env.NODE_ENV === "development") {
      console.log("--- DEVELOPMENT MODE: Bypassing callback validation ---");
      callbackResponse = {
        type: req.body.type,
        payload: req.body.payload,
      };
    } else {
      // In production, we run the real validation.
      const authorizationHeader = req.headers["authorization"];
      const responseBodyString = JSON.stringify(req.body);
      const client = phonepeClient; // Use the shared client
      const usernameConfigured = process.env.PHONEPE_WEBHOOK_USERNAME;
      const passwordConfigured = process.env.PHONEPE_WEBHOOK_PASSWORD;

      callbackResponse = client.validateCallback(
        usernameConfigured,
        passwordConfigured,
        authorizationHeader,
        responseBodyString
      );
    }
    // --- END: DEVELOPMENT-ONLY BYPASS ---

    const eventType = callbackResponse.type;
    const payload = callbackResponse.payload;

    console.log(`Received callback event: ${eventType}`);

    if (eventType === "CHECKOUT_ORDER_COMPLETED") {
      const contractId = payload.metaInfo.contractId;
      settleSuccessfulRepayment(contractId);
    } else if (eventType === "CHECKOUT_ORDER_FAILED") {
      console.error(
        `Payment failed for Order ID: ${payload.originalMerchantOrderId}.`
      );
    }

    res.status(200).send();
  } catch (error) {
    console.error("Callback validation failed:", error.message);
    res.status(400).send("Callback validation failed");
  }
};
