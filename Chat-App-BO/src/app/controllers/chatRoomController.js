const ChatRoom = require('../models/ChatRoom');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');

class ChatRoomController {
    //[GET]/chatRooms
    async index(req, res, next) {
        try {
            const chatRooms = await ChatRoom.find({});
            // res.json(chatRooms)
            res.render('chatRoom', {
                chatRooms: multipleMongooseToObject(chatRooms)
            })
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const chatRooms = await ChatRoom.deleteOne({ _id: req.params.id });
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }
}





module.exports = new ChatRoomController();