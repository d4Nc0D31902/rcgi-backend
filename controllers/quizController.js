const Quiz = require("../models/quiz");
const ErrorHandler = require("../utils/errorHandler");

exports.newQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }
    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateQuiz = async (req, res, next) => {
//   try {
//     let quiz = await Quiz.findById(req.params.id);
//     if (!quiz) {
//       return next(new ErrorHandler("Quiz not found", 404));
//     }
//     quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     });
//     res.status(200).json({
//       success: true,
//       quiz,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }

    // Parse the content field from string to JSON
    req.body.content = JSON.parse(req.body.content);

    // Update the quiz with the parsed content
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return next(new ErrorHandler("Quiz not found", 404));
    }
    await quiz.remove();
    res.status(200).json({
      success: true,
      message: "Quiz deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};
