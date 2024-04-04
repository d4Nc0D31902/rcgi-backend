const Lesson = require("../models/lesson");
const ErrorHandler = require("../utils/errorHandler");

exports.newLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new ErrorHandler("Lesson not found", 404));
    }
    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new ErrorHandler("Lesson not found", 404));
    }
    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new ErrorHandler("Lesson not found", 404));
    }
    await lesson.remove();
    res.status(200).json({
      success: true,
      message: "Lesson deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json({
      success: true,
      lessons,
    });
  } catch (error) {
    next(error);
  }
};

exports.markLessonAsDone = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new ErrorHandler("Lesson not found", 404));
    }

    lesson.status = "Done";
    await lesson.save();

    res.status(200).json({
      success: true,
      message: "Lesson marked as done",
      lesson,
    });
  } catch (error) {
    next(error);
  }
};
