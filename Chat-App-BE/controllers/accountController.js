const userModel = require('../models/users');

exports.listAccount = async (req, res) => {
  const dataAccount = await userModel.find();

  return dataAccount.length > 0
    ? res.status(200).json(dataAccount)
    : res.status(500).json('Hệ thống gặp gián đoạn');
};

exports.editName = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    { username: name },
    { new: true }
  );

  if (user) {
    console.log('==========================success change');
    res.status(200).json('Đổi tên thành công !');
  } else {
    console.log(`============================can't change`);
    res.status(404).json('Đổi tên thất bại !');
  }
};

exports.findUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User isn't valid" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log('[ERR] : ', err);
    res.status(500).json(err);
  }
};

exports.findUserById = async (req, res) => {
  const { id } = req.params;
  console.log('==============', id);
  try {
    const user = await userModel.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ message: 'Khong tim thay user' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log('[ERR] : ', err);
    res.status(500).json(err);
  }
};
