const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const signUp = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
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
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      msg: "Signup failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Login failed",
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        msg: "Login failed",
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "13h",
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
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Login failed",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, password, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Password reset failed",
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        msg: "Password reset failed",
        error: "Invalid password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Password reset successful",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Password reset failed",
      error: error.message,
    });
  }
};

const checkAuth = async (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "User is authenticated",
    user: {
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
};
module.exports = { signUp, login, resetPassword, checkAuth };
