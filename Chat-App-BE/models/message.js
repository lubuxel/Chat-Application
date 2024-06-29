const mongoose = require('mongoose');

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

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
