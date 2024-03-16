const Chapter = require("../models/chapter");
const ErrorHandler = require("../utils/errorHandler");

exports.newChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.create(req.body);
    res.status(201).json({
      success: true,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return next(new ErrorHandler("Chapter not found", 404));
    }
    res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateChapter = async (req, res, next) => {
  try {
    let chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return next(new ErrorHandler("Chapter not found", 404));
    }
    chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return next(new ErrorHandler("Chapter not found", 404));
    }
    await chapter.remove();
    res.status(200).json({
      success: true,
      message: "Chapter deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find();
    res.status(200).json({
      success: true,
      chapters,
    });
  } catch (error) {
    next(error);
  }
};
