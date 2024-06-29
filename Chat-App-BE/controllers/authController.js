const bcrypt = require('bcrypt');

const userModel = require('../models/users');

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

exports.signup = async (req, res) => {
  console.log('===[SIGNUP]');
  const { password, isAdmin, email, avatar } = req.body;
  try {
    const checkEmail = await userModel.findOne({
      email: email,
    });
    if (checkEmail) {
      return res.status(500).json('Email đã tồn tại');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const newUser = new userModel({
        email: email,
        password: hashed,
        isAdmin: isAdmin,
        code: generateString(6),
        username: `user${generateString(4)}`,
        avatar: avatar || '../assets/picture/defaultAva.jpg',
      });
      const data = await userModel.create(newUser);
      return data
        ? res.status(200).json(data)
        : res.status(500).json('Hệ thống bị gián đoạn. Vui lòng thử lại');
    }
  } catch (err) {
    res.status(500).err;
  }
};

exports.signin = async (req, res) => {
  console.log('===[SIGNIN]');
  const { email, password } = req.body;
  try {
    const data = await userModel.findOne({
      email: email,
    });
    const validate = await bcrypt.compare(password, data.password);
    return validate === true
      ? res.status(200).json(data)
      : res.status(400).json('Sai thong tin ! Moi ban nhap lai ');
  } catch (err) {
    console.log('[ERR] :', err);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword, reTypePassword } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (user) {
    if (user?.code === code) {
      if (newPassword === reTypePassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        const newCode = generateString(6);
        const newUser = await user.updateOne({
          password: hashed,
          code: newCode.trim(),
        });
        res.status(200).json(newUser);
      } else res.status(404).json('Mật khẩu nhập lại không khớp');
    } else {
      res.status(404).json('Sai mã xác thực');
    }
  } else {
    res.status(404).json('inValid');
  }
};
