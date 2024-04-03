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

    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Signup successful",
      user,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Login successful",
      token,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
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
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
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
      error: error.message,
    });
  }
};

module.exports = { signUp, login, resetPassword };
