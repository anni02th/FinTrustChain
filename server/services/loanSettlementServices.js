import Contract from "../models/contractModel.js";
import User from "../models/userModel.js";
import LoanRequest from "../models/loanRequestModel.js";
import * as trustIndexService from "./trustIndexService.js";
import * as userService from "./userService.js";

export async function settleSuccessfulRepayment(contractId) {
  try {
    console.log(`Starting settlement process for Contract ID: ${contractId}`);

    // 1. Fetch the contract and all associated parties
    const contract = await Contract.findById(contractId)
      .populate("receiver")
      .populate("guarantor");

    if (!contract || contract.status === "REPAID") {
      console.log(
        `Contract ${contractId} not found or already repaid. Skipping settlement.`
      );
      return;
    }

    const receiver = contract.receiver;
    const guarantor = contract.guarantor;

    // Find all users who endorsed the receiver at the time of the contract
    const endorsers = await User.find({
      _id: { $in: receiver.endorsementsReceived },
    });

    // --- Calculate TI Gain for the Receiver ---
    const now = new Date();
    const endDate = new Date(contract.endDate);
    const daysEarly = Math.max(
      0,
      Math.floor((endDate - now) / (1000 * 60 * 60 * 24))
    );

    const receiverTIGain = trustIndexService.getLoanRepaymentGain(
      receiver.trustIndex,
      contract.principal,
      daysEarly,
      contract.tenorDays
    );

    // --- Apply TI Updates using the centralized userService ---
    // Update Receiver
    await userService.updateTrustIndex(
      receiver,
      receiverTIGain,
      `Loan Repayment: ${contractId}`
    );
    receiver.successfulRepayments += 1;
    await receiver.save();
    console.log(
      `Updated Receiver ${receiver.name}. TI Gain: ${receiverTIGain}`
    );

    // Update Guarantor
    if (guarantor) {
      const guarantorTIGain =
        trustIndexService.getGuarantorImpact(receiverTIGain);
      await userService.updateTrustIndex(
        guarantor,
        guarantorTIGain,
        `Guaranteed Loan Repaid: ${contractId}`
      );
      console.log(
        `Updated Guarantor ${guarantor.name}. TI Gain: ${guarantorTIGain}`
      );
    }

    // Update Endorsers
    if (endorsers.length > 0) {
      const endorserTIGain = trustIndexService.getEndorserImpact(
        receiverTIGain,
        endorsers.length
      );
      for (const endorser of endorsers) {
        await userService.updateTrustIndex(
          endorser,
          endorserTIGain,
          `Endorsed Loan Repaid: ${contractId}`
        );
        console.log(
          `Updated Endorser ${endorser.name}. TI Gain: ${endorserTIGain}`
        );
      }
    }

    // --- Finalize Contract and Loan Request Status ---
    contract.status = "REPAID";
    await contract.save();

    await LoanRequest.findByIdAndUpdate(contract.loanRequest, {
      status: "FULFILLED",
    });

    console.log(
      `Settlement process for Contract ID: ${contractId} completed successfully.`
    );
  } catch (error) {
    console.error(
      `Error during settlement for Contract ID ${contractId}:`,
      error
    );
  }
}

/**
 *  Handles all database and TrustIndex updates after a loan defaults.
 * @param {object} contract - The contract document that has defaulted.
 */
export async function settleDefaultedLoan(contract) {
  try {
    console.log(`Starting default settlement for Contract ID: ${contract._id}`);

    // 1. Fetch all associated parties
    const receiver = await User.findById(contract.receiver);
    const guarantor = await User.findById(contract.guarantor);
    const endorsers = await User.find({
      _id: { $in: receiver.endorsementsReceived },
    });

    // --- Calculate TI Loss for the Receiver ---
    const now = new Date();
    const endDate = new Date(contract.endDate);
    const daysLate = Math.max(
      0,
      Math.floor((now - endDate) / (1000 * 60 * 60 * 24))
    );

    const receiverTILoss = trustIndexService.getLoanDefaultLoss(
      receiver.trustIndex,
      contract.principal,
      daysLate
    );

    // --- Apply TI Updates using the centralized userService ---
    // Update Receiver
    await userService.updateTrustIndex(
      receiver,
      -receiverTILoss,
      `Loan Default: ${contract._id}`
    );
    receiver.defaults += 1;
    await receiver.save();
    console.log(
      `Updated Receiver ${receiver.name}. TI Loss: ${receiverTILoss}`
    );

    // Update Guarantor
    if (guarantor) {
      const guarantorTILoss =
        trustIndexService.getGuarantorImpact(receiverTILoss);
      await userService.updateTrustIndex(
        guarantor,
        -guarantorTILoss,
        `Guaranteed Loan Defaulted: ${contract._id}`
      );
      console.log(
        `Updated Guarantor ${guarantor.name}. TI Loss: ${guarantorTILoss}`
      );
    }

    // Update Endorsers
    if (endorsers.length > 0) {
      const endorserTILoss = trustIndexService.getEndorserImpact(
        receiverTILoss,
        endorsers.length
      );
      for (const endorser of endorsers) {
        await userService.updateTrustIndex(
          endorser,
          -endorserTILoss,
          `Endorsed Loan Defaulted: ${contract._id}`
        );
        console.log(
          `Updated Endorser ${endorser.name}. TI Loss: ${endorserTILoss}`
        );
      }
    }

    // --- Finalize Contract Status ---
    contract.status = "DEFAULT";
    await contract.save();

    console.log(
      `Default settlement for Contract ID: ${contract._id} completed successfully.`
    );
  } catch (error) {
    console.error(
      `Error during default settlement for Contract ID ${contract._id}:`,
      error
    );
  }
}
