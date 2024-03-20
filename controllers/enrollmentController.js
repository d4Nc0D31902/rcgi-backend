const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");

exports.newEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.joinEnrollment = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("user")
      .populate("course");
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.myEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("user", "name")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.updateEnrollment = async (req, res, next) => {
  try {
    let enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    await enrollment.remove();
    res.status(200).json({
      success: true,
      message: "Enrollment deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find();
    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

exports.addLesson = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const lesson = await Lesson.create(req.body);

    enrollment.lessons.push(lesson._id);
    await enrollment.save();

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};
