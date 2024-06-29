const express = require('express');
const router = express.Router();
const chatRoomController = require("../app/controllers/chatRoomController");

//Delete
router.delete('/:id', chatRoomController.delete)
//Get
router.get('/', chatRoomController.index);

module.exports = router;


