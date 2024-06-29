const express = require('express');
const router = express.Router();
const messageController = require("../app/controllers/messageController");

router.delete('/:id', messageController.delete)
//Get
router.get('/', messageController.index);

module.exports = router;