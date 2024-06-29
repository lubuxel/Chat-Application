const mongoose = require("mongoose");
const chatRoomSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatRoomSchema);