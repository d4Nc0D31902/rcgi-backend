const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    reply: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        reply: {
          type: String,
        },
        createdAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Forum", forumSchema);
