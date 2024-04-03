const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const signUp = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!username || !firstName || !lastName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      msg: "All fields are required",
    });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "User already exists",
      });
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Password length must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }

    // Hash the password
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Registered Successfully!",
      user: {
        username,
        firstName,
        lastName,
        email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      msg: "Please provide email and password",
    });
  }
  try {
    // Find user by email (case-insensitive)
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email.toLowerCase(), "i") },
    });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password, password, isMatch)
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "Invalid email or password",
      });
    }

    // Generate JWT token
    const userObj = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(userObj, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      token,
      username: user.username,
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error" });
  }
};



// const checkAuth = async (req, res) => {
//   const { username, userId } = req.user;
//   res.status(StatusCodes.OK).json({
//     status: "success",
//     msg: "User is authenticated",
//     username,
//     userId,
//   });
// };

module.exports = {
  signUp,
  login,
  // checkAuth,
};
