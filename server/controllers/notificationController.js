import Notification from "../models/notificationModel.js";

// GET /notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.status(200).json({
      status: "success",
      results: notifications.length,
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/:id/read

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      throw new Error(
        "Notification not found or you are not authorized to update it."
      );
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      status: "success",
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};
