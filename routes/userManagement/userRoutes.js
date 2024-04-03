const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  checkAuth,
} = require("../../controllers/userManagement/authController");

router.post("/signup", signUp);

router.post("/login", login);

module.exports = router;
