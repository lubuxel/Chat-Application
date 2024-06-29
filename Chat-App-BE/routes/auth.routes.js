const express = require('express');
const router = express.Router();

const {
  signin,
  signup,
  resetPassword,
} = require('../controllers/authController');

router.post('/signup', signup); //đăng kí
router.post('/signin', signin); //đăng nhập
router.post('/resetPassword', resetPassword);

module.exports = router;
