const { StatusCodes } = require("http-status-codes");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// Get all users
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    status: "success",
    users,
  });
});

// Get user by id
const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    user,
  });
});

// Update user
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, firstName, lastName, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, firstName, lastName, email },
    { new: true }
  );
  if (!updatedUser) {
    return next(new AppError("User not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    user: updatedUser,
  });
});


// Delete user
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return next(new AppError("User not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "User deleted successfully",
    user: deletedUser,
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
