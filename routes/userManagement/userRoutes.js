const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  resetPassword,
} = require("../../controllers/userManagement/authController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;
