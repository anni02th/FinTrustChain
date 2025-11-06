import cron from "node-cron";
import Contract from "../models/contractModel.js";
import User from "../models/userModel.js";
import { settleDefaultedLoan } from "../services/loanSettlementServices.js";

const checkOverdueConfirmations = async () => {
  console.log(
    "Running scheduled job: Checking for overdue receipt confirmations..."
  );
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const overdueContracts = await Contract.find({
      status: "AWAITING_RECEIPT_CONFIRMATION",
      updatedAt: { $lte: twentyFourHoursAgo },
    }).populate("receiver");
    if (overdueContracts.length === 0) {
      console.log("No overdue contracts found. Job finished.");
      return;
    }
    console.log(
      `Found ${overdueContracts.length} overdue contract(s) to process.`
    );
    for (const contract of overdueContracts) {
      const receiver = contract.receiver;
      if (receiver && receiver.status !== "BLOCKED") {
        receiver.status = "BLOCKED";
        await receiver.save();
        console.log(
          `User ${receiver.name} (ID: ${receiver._id}) has been BLOCKED for not confirming receipt on time for Contract ID: ${contract._id}.`
        );
      }
    }
  } catch (error) {
    console.error("Error during scheduled job execution:", error);
  }
};

export const checkLoanDefaults = async () => {
  console.log("Running scheduled job: Checking for loan defaults...");
  try {
    const now = new Date();

    // Find all contracts that are still 'ACTIVE' but whose 'endDate' is in the past.
    const overdueContracts = await Contract.find({
      status: "ACTIVE",
      endDate: { $lt: now },
    });

    if (overdueContracts.length === 0) {
      console.log("No defaulted loans found. Job finished.");
      return;
    }

    console.log(
      `Found ${overdueContracts.length} defaulted loan(s) to process.`
    );

    // Process each defaulted loan using our settlement service
    for (const contract of overdueContracts) {
      await settleDefaultedLoan(contract);
    }
  } catch (error) {
    console.error("Error during loan default check:", error);
  }
};

export const startScheduler = () => {
  // Runs at minute 0 of every hour
  cron.schedule("0 * * * *", checkOverdueConfirmations);

  // Runs once a day at midnight
  cron.schedule("0 0 * * *", checkLoanDefaults);

  console.log(
    "Scheduler started. Jobs for overdue confirmations and loan defaults are running."
  );
};
