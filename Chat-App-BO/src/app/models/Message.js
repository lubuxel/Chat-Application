const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      require: true,
    },
    senderId: { type: String, require: true },
    text: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);