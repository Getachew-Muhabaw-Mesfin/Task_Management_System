const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../../controllers/userManagement/authController");
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
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/checkAuth", authMiddleware, checkAuth);

//User routes
router.use(authMiddleware);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
