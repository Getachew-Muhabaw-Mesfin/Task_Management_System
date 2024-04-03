const { StatusCodes } = require("http-status-codes");
const User = require("../../models/userModel");
const { use } = require("../../routes/userManagement/userRoutes");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(StatusCodes.OK).json({
      status: "success",
      users,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      error: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "User not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      error: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, firstName, lastName, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, firstName, lastName, email },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "User not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      user: updatedUser,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "User not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
