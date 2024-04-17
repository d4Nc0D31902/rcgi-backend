const mongoose = require("mongoose");
const notificationsSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notifications", notificationsSchema);
