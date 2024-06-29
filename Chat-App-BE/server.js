const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const emailRoutes = require('./routes/email.routes');

const userRouters = require('./routes/user.routes');
const accountRoutes = require('./routes/account.routes');
const chatRoutes = require('./routes/chatRoom.routes');
const messageRoutes = require('./routes/message.routes');
const mongoose = require('mongoose');
const app = express();
const { Server } = require('socket.io');
const io = new Server({ cors: 'http://localhost:5000' });
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('new connection : ', socket.id);
  socket.on('addNewUser', (userId) => {
    !onlineUsers.some((user) => {
      return user.userId === userId;
    }) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log('==========onlineUser', onlineUsers);

    io.emit('getOnlineUser', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((item) => {
      return item.socketId !== socket.id;
    });
    io.emit('getOnlineUser', onlineUsers);
  });
});

io.listen(5000);

const PORT = process.env.PORT || 7777;
const MONGOURL =
  process.env.MONGOURL ||
  'mongodb+srv://chat-app:cuoctrochuyentinhcum@cluster0.aq1nchk.mongodb.net/chat-app';
const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200,
};
mongoose.connect(MONGOURL);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', emailRoutes);

app.use('/api/users', userRouters);
app.use('/api', accountRoutes);
app.use('/api', chatRoutes);

app.use('/api', messageRoutes);
app.listen(PORT, console.log('==============Success run in port', PORT));
