import mongoose from "mongoose";
import User from "../models/userModel.js";
import Endorsement from "../models/endorsementModel.js";
import * as trustIndexService from "../services/trustIndexService.js";
import * as userService from "../services/userService.js";

//POST /endorsements
export const createEndorsement = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const endorser = req.user;
    const { receiverId } = req.body;

    // --- 1. Validation and Business Rules ---
    if (endorser.id === receiverId) {
      throw new Error("You cannot endorse yourself.");
    }

    // --- 2. Check for existing endorsement relationship ---
    const existingEndorsement = await Endorsement.findOne({
      endorser: endorser.id,
      receiver: receiverId,
    }).session(session);

    if (existingEndorsement) {
      if (existingEndorsement.status === "ACTIVE") {
        throw new Error("You have already endorsed this user.");
      } else if (existingEndorsement.status === "REMOVED") {
        throw new Error(
          "You cannot re-endorse a user after removing a previous endorsement."
        );
      }
    }

    // --- 3. "4 Endorsers Per Month" Rule  ---
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const endorsementCount = await Endorsement.countDocuments({
      endorser: endorser.id,
      status: "ACTIVE",
      createdAt: { $gte: oneMonthAgo },
    }).session(session);

    if (endorsementCount >= 4) {
      throw new Error("You can only endorse a maximum of 4 users per month.");
    }

    // --- 4. Calculate TI Gain and Update Users ---
    const receiver = await User.findById(receiverId).session(session);
    if (!receiver)
      throw new Error("The user you are trying to endorse does not exist.");

    const tiGain = trustIndexService.getInitialEndorsementGain(
      receiver.trustIndex
    );
    await userService.updateTrustIndex(
      receiver,
      tiGain,
      "Received Endorsement"
    );
    receiver.endorsementsReceived.push(endorser.id);
    endorser.endorsementsGiven.push(receiver.id);

    // --- 5. Save All Changes ---
    await receiver.save({ session });
    await endorser.save({ session });
    await Endorsement.create(
      [{ endorser: endorser.id, receiver: receiver.id, status: "ACTIVE" }],
      { session }
    );

    await session.commitTransaction();
    res
      .status(201)
      .json({ status: "success", message: "Endorsement successful." });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// DELETE /endorsements/:id

export const removeEndorsement = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const endorser = req.user;
    const receiverId = req.params.id;

    // --- 1. Find the ACTIVE endorsement to remove ---
    const endorsement = await Endorsement.findOne({
      endorser: endorser.id,
      receiver: receiverId,
      status: "ACTIVE",
    }).session(session);

    if (!endorsement) {
      throw new Error("You do not have an active endorsement for this user.");
    }

    // --- 2. Calculate TI Loss and Update Users ---
    const receiver = await User.findById(receiverId).session(session);
    if (!receiver)
      throw new Error("The user you are trying to un-endorse does not exist.");

    const tiLoss = trustIndexService.getInitialEndorsementLoss(
      receiver.trustIndex
    );
    receiver.trustIndex -= tiLoss;

    endorser.endorsementsGiven.pull(receiverId);
    receiver.endorsementsReceived.pull(endorser.id);

    // --- 3. Update Endorsement Status ---
    // Instead of deleting, we update the status to 'REMOVED'.
    endorsement.status = "REMOVED";

    // --- 4. Save All Changes ---
    await receiver.save({ session });
    await endorser.save({ session });
    await endorsement.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      status: "success",
      message: "Endorsement removed successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
