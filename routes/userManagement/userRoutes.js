const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  resetPassword,
  checkAuth,
} = require("../../controllers/userManagement/authController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/reset-password", resetPassword);

// Auth middleware check
router.get("/checkAuth", authMiddleware, checkAuth);

module.exports = router;
