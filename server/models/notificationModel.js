import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // The user who will receive this notification.
    // This is indexed for fast lookups of a user's inbox.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The text content of the notification.
    message: {
      type: String,
      required: [true, "A notification must have a message."],
    },

    link: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    // `createdAt` is our primary time-measuring field.
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
