const express = require('express');
const router = express.Router();
const detailController = require('../app/controllers/detailController');

router.get('/:email', detailController.show);

module.exports = router;