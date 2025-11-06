import * as trustIndexService from "./trustIndexService.js";

/**
 * The single point of truth for updating a user's TrustIndex and all dependent fields.
 * @param {object} user - The mongoose user document to update.
 * @param {number} changeAmount - The amount to add or subtract from the TrustIndex (e.g., +20 or -5).
 * @param {string} reason - A short description for the history log (e.g., 'Initial Endorsement').
 */
export async function updateTrustIndex(user, changeAmount, reason) {
  // 1. Calculate and clamp the new TrustIndex
  const newTI = trustIndexService.clampTI(user.trustIndex + changeAmount);
  user.trustIndex = newTI;

  // 2. Add a record to the user's TI history
  user.tiHistory.push({
    value: newTI,
    change: changeAmount,
    reason: reason,
    date: new Date(),
  });

  // 3. Update the user's milestone (eligible loan amount)
  user.milestones.eligibleLoan = trustIndexService.getMaxLoanLimit(newTI);

  // 5. Save the updated user document
  await user.save({ validateBeforeSave: false });
}
