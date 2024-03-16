const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    modules: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Module",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
