const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// SIGNUP
const signUp = catchAsync(async (req, res, next) => {
  const { username, firstName, lastName, email, password } = req.body;
  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password,
  });
  user.save();
  res.status(StatusCodes.CREATED).json({
    status: "success",
    msg: "Signup successful",
    user,
  });
});

//LOGIN
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new AppError("Invalid email or password", StatusCodes.BAD_REQUEST)
    );
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(
      new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED)
    );
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Login successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email, password, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Password reset failed", StatusCodes.NOT_FOUND));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(
      new AppError("Password reset failed", StatusCodes.UNAUTHORIZED)
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Password reset successful",
  });
});


//CHECK AUTHENTICATION
const checkAuth = async (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "User is authenticated",
    user: req.user,
  });
};

module.exports = { signUp, login, resetPassword, checkAuth };
