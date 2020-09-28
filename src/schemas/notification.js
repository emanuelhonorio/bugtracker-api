const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: Number,
    text: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
