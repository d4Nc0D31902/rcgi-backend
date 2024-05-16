const Feedback = require("../models/feedback");
const ErrorHandler = require("../utils/errorHandler");
const Notification = require("../models/notifications");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

exports.newFeedback = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const feedback = await Feedback.create({
      user: userId,
      feedback: req.body.feedback,
    });

    // Notification Logic
    const employeeNotification = new Notification({
      message: `Your feedback has been submitted`,
      user: req.user._id,
    });
    await employeeNotification.save();

    await global.io.timeout(1000).emit(`notification`, {
      message: "Sending notifications to admins...",
      user: req.user._id,
    });

    const admins = await User.find({
      role: { $in: ["admin"] },
    });
    for (const user of admins) {
      const adminNotification = new Notification({
        message: "New feedback has been submitted",
        user: user._id,
      });
      await adminNotification.save();
    }

    //Email Logic
    const user = await User.findById(feedback.user);

    const emailOptions = {
      email: req.user.email,
      subject: "Feedback",
      message: `${feedback.feedback}`,
      html: `
      <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #800000; margin-bottom: 20px; text-align:"center";>Employee Feedback</h2>

      <hr style="border: 1px solid #ccc; margin: 20px 0;">

      <table style="width: 100%; border-collapse: collapse;">
          <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Feedback:</th>
              <th style="border: 1px solid #ccc; padding: 8px;">${feedback.feedback}</th>
          </tr>
          <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Employee:</th>
          <th style="border: 1px solid #ccc; padding: 8px;">${user.name}</th>
      </tr>
      <tr>
      <th style="border: 1px solid #ccc; padding: 8px;">Company:</th>
      <th style="border: 1px solid #ccc; padding: 8px;">${user.company}</th>
  </tr>
        </table>
  </div>
  `,
    };

    // Send Email
    await sendEmail(emailOptions);

    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "user",
      "name company"
    );
    if (!feedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }
    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFeedback = async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }
    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }
    await feedback.remove();
    res.status(200).json({
      success: true,
      message: "Feedback deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "name company");
    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
