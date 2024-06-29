const Message = require('../models/Message');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');

class MessageController {
    //[GET]/messages
    async index(req, res, next) {
        try {
            const messages = await Message.find({});
            // res.json(messages)
            res.render('message', {
                messages: multipleMongooseToObject(messages)
            })
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const messages = await Message.deleteOne({ _id: req.params.id });
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessageController();