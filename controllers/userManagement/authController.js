const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

// SIGNUP
const signUp = catchAsync(async (req, res, next) => {
  const { username, firstName, lastName, email, password, passwordConfirm } =
    req.body;
  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
  });
  user.save();
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Signup successful",
    user,
  });
});

//LOGIN
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Login successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

//Forget Password
const forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with email address", StatusCodes.NOT_FOUND)
    );
  }

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

//RESET PASSWORD
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) GEt USER Based on the Token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(user);
  // 2) If the token has not expired and there is user set the new password
  if (!user) {
    return next(
      new AppError("Token is invalid or has expired", StatusCodes.BAD_REQUEST)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update the ChangePasswordAt property  for the user in the database

  // 4) Log the user in, send JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Password reset successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

//Update the password

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  user.passwordConfirm = undefined;
  // 4) Log user in, send JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Password updated successfully",
    token,
    user: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

//CHECK AUTHENTICATION
const checkAuth = async (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User is authenticated",
    user: req.user,
  });
};

module.exports = {
  signUp,
  login,
  resetPassword,
  forgotPassword,
  checkAuth,
  updatePassword,
};
