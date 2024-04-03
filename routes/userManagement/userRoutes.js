const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  resetPassword,
  checkAuth,
} = require("../../controllers/userManagement/authController");
//TODO: make it on the app.js to all tasks
const authMiddleware = require("../../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/userManagement/userController");

//Auth routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/checkAuth", authMiddleware, checkAuth);

//User routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
