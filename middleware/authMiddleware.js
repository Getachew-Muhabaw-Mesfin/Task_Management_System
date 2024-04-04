const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");       

const authMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(
      new AppError(
        "Not authorized to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new AppError("No user found", StatusCodes.UNAUTHORIZED));
  }
  req.user = user;
  next();
});

module.exports = authMiddleware;
