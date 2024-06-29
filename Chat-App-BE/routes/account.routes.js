const express = require('express');
const router = express.Router();

const {
  listAccount,
  editName,
  findUser,
  findUserById,
} = require('../controllers/accountController');

router.get('/listAccount', listAccount); //danh sach account
router.post('/:id/editName', editName);
router.post('/find', findUser);
router.get('/:id', findUserById);

module.exports = router;
