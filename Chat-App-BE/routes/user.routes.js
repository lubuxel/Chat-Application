const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

// Định nghĩa tuyến đường API danh sách người dùng

router.get("/listAccount", getUsers);

module.exports = router;
