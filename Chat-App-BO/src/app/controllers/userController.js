const User = require('../models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const generateString = require('../helper/generateString');


class UserController {
  //[GET] /users
  async index(req, res, next) {
    try {
      const users = await User.find({});
      res.render('user', {
        users: multipleMongooseToObject(users)
      });
    } catch (error) {
      next(error);
    }
  }

  //[[GET]]/api/userList/create
  async create(req, res, next) {
    try {
      res.render('users/create');
    } catch (error) {
      next(error)
    }
  }
  //[[POST]]/api/userList/store
  async store(req, res, next) {
    const { password, isAdmin, email } = req.body;
    try {
      const checkEmail = await User.findOne({
        email: email,
      });
      if (checkEmail) {
        return res.render('users/failed');
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email: email,
          password: hashedPassword,
          isAdmin: isAdmin,
          code: generateString(6),
          username: `user${generateString(4)}`,
        });
        const data = await User.create(newUser);
        return data
          ? res.redirect('/api/userList')
          : res.status(500).json("Create fail")
      }
    } catch (error) {
      next(error);
    }
  }
  //[[GET]]/api/userList/:id/edit
  async edit(req, res, next) {
    try {
      const users = await User.findById(req.params.id);
      res.render('users/edit', {
        users: mongooseToObject(users)
      });
    } catch (error) {
      next(error)
    }
  }
  //[[PUT]]/api/userList/:id
  async update(req, res, next) {
    try {
      const { password, ...updateData } = req.body;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const users = await User.updateOne({ _id: req.params.id }, updateData);
      res.redirect('/api/userList');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const users = await User.deleteOne({ _id: req.params.id });
      res.redirect('back');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
