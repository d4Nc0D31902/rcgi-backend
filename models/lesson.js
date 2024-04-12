const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      // required: true,
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

module.exports = mongoose.model("Lesson", lessonSchema);
