const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: [
      {
        questions: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
          },
        ],
        answer: {
          type: String,
        },
      },
    ],
    totalScore: {
      type: Number,
    },
    // status: {
    //   type: String,
    //   enum: {
    //     values: ["Not Done", "Done"],
    //   },
    //   default: "Not Done",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
