const mongoose = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
