const express = require('express');
const {
  createMessage,
  getMessage,
} = require('../controllers/messageController');
const router = express.Router();

router.post('/createMessage', createMessage);
router.post('/getMessage', getMessage);

module.exports = router;
