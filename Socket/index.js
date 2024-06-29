const { Server } = require("socket.io");
const io = new Server({ cors: "http://localhost:3000" });

let onlineUser = [];
io.on("connection", (socket) => {
  console.log("============new connection", socket.id);

  //listen to a connection
  socket.on("addNewUser", (userId) => {
    return (
      !onlineUser.some((user) => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      })
    );
  });

  console.log('================ newOnlineUser', onlineUser);

  io.emit("getOnlineUser", onlineUser);

  //add message
  socket.on("sendMessage", (message) => {
    const user = onlineUser.find((user) => user.userId === message.recipientId);
    console.log("======================", (user) => user.userId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", (reason) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    console.log("==============onlineUseasdasdasdr", reason);
    io.emit("getOnlineUser", onlineUser);
  });

  // socket.on('sendMessage', (message) => {
  //   io.to(message.chatMember).emit('getMessage', message.messageContent);
  // });
});

io.listen(2304);

