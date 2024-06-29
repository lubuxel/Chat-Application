
const userRouter = require('./user.route');
const detailRouter = require('./detail.route');
const chatRoomRouter = require('./chatRoom.route');
const messageRouter = require('./message.route');

function route(app) {
    //Dinh tuyen trang list User la /api/userList
    app.use('/api/userList/detail', detailRouter);
    app.use('/api/userList', userRouter);

    //DInh tuyen trang list ChatRoom la /api/chatRoomList
    app.use('/api/chatRoomList', chatRoomRouter);

    //Dinh tuyen trang list Message la /api/messageList
    app.use('/api/messageList', messageRouter);

}

module.exports = route;
