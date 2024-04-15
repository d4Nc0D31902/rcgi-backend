const mongoose = require("mongoose");

const submitSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  chapter: {
    type: mongoose.Schema.ObjectId,
    ref: "Chapter",
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
  },
  score: {
    type: Number,
  },
  result: {
    type: String,
  },
});

const retakeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  chapter: {
    type: mongoose.Schema.ObjectId,
    ref: "Chapter",
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
  },
  retake: {
    type: Number,
  },
});

const enrollmentSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    course: [
      {
        courseId: {
          type: mongoose.Schema.ObjectId,
          ref: "Course",
        },
        status: {
          type: String,
          enum: {
            values: ["Not Done", "Done"],
          },
          default: "Not Done",
        },
      },
    ],
    module: [
      {
        moduleId: {
          type: mongoose.Schema.ObjectId,
          ref: "Module",
          required: true,
        },
        chapter: [
          {
            chapterId: {
              type: mongoose.Schema.ObjectId,
              ref: "Chapter",
              required: true,
            },
            lessons: [
              {
                lessonId: {
                  type: mongoose.Schema.ObjectId,
                  ref: "Lesson",
                  required: true,
                },
                status: {
                  type: String,
                  enum: ["Not Done", "Done"],
                  default: "Not Done",
                },
              },
            ],
            quizzes: [
              {
                quizId: {
                  type: mongoose.Schema.ObjectId,
                  ref: "Quiz",
                  required: true,
                },
                status: {
                  type: String,
                  enum: ["Not Done", "Done"],
                  default: "Not Done",
                },
              },
            ],
            status: {
              type: String,
              enum: ["Not Done", "Done"],
              default: "Not Done",
            },
          },
        ],
        status: {
          type: String,
          enum: ["Not Done", "Done"],
          default: "Not Done",
        },
      },
    ],
    submit: [submitSchema],
    retake: [retakeSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
