const express = require("express");
const router = express.Router();
const {
  login,
  register,
  resetPassword,
  newPassword,
} = require("../../controllers/userManagement/userController");

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Reset password
router.post("/reset-password", resetPassword);

// Set new password
router.post("/new-password", newPassword);

module.exports = router;
