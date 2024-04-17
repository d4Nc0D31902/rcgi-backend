const Notification = require("../models/notifications");
const ErrorHandler = require("../utils/errorHandler");

exports.newNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    notification.status = "read";
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { status: "read" });
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNotification = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
    await notification.remove();
    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
};

// exports.getNotifications = async (req, res, next) => {
//   try {
//     const notifications = await Notification.find().populate("user");
//     res.status(200).json({
//       success: true,
//       notifications,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getNotifications = async (req, res, next) => {
  try {
    // Fetch notifications only for the logged-in user
    const notifications = await Notification.find({
      user: req.user.id,
    }).populate("user");

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(new ErrorHandler("Failed to retrieve notifications", 500));
  }
};
