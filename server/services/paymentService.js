import phonepe from "pg-sdk-node";
const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = phonepe;

import { randomUUID } from "crypto";
import Contract from "../models/contractModel.js";

// --- Initialize the PhonePe Client (Singleton Pattern) ---
const clientId = process.env.PHONEPE_CLIENT_ID;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
const clientVersion = process.env.PHONEPE_CLIENT_VERSION;
const env = Env.SANDBOX;

if (!clientId || !clientSecret || !clientVersion) {
  throw new Error(
    "PhonePe client credentials are not configured in .env file."
  );
}

const phonepeClient = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

/**
 * Initiates a payment transaction with PhonePe.
 * @param {string} contractId - The ID of the contract.
 * @param {object} user - The user object of the person paying.
 * @param {number} [paymentAmount] - Optional: The specific amount to pay. If not provided, defaults to the contract's principal.
 * @returns {string} The redirect URL for the PhonePe checkout page.
 */
export async function initiatePayment(contractId, user, paymentAmount) {
  try {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      throw new Error("Contract not found.");
    }

    // Use the provided paymentAmount or default to the contract's principal.
    const payableAmount =
      (contract.principal * contract.interestRate) / 100 + contract.principal;
    const amountToPay =
      paymentAmount !== undefined ? paymentAmount : payableAmount;

    if (typeof amountToPay !== "number" || amountToPay <= 0) {
      throw new Error("Invalid amount for payment.");
    }

    const amountInPaisa = Math.round(amountToPay * 100);
    const uniqueSuffix = randomUUID().slice(0, 8);
    const merchantOrderId = `CONTR_${contractId}_${uniqueSuffix}`;
    const redirectUrl = `http://localhost:3000/payment-status/${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaisa)
      .redirectUrl(redirectUrl)
      .metaInfo({
        contractId: contractId.toString(),
        payerId: user._id.toString(),
      }) // Pass payer info
      .build();

    const response = await phonepeClient.pay(request);
    return response.redirectUrl;
  } catch (error) {
    console.error("PhonePe Payment Initiation Error:", {
      message: error.message,
      httpStatusCode: error.httpStatusCode,
      data: error.data,
    });

    throw new Error("Could not initiate payment. Please try again later.");
  }
}

// Export the initialized client so other files can use it.
export { phonepeClient };
