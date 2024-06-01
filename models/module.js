const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
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
    chapters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Chapter",
      },
    ],
    forum: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Forum",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Module", moduleSchema);
