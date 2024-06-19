const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      // required: true,
    },
    lessons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Lesson",
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);
