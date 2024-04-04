const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");
const Comment = require("../../models/commentModel");
const Notification = require("../../models/notificationModel");
const Category = require("../../models/categoryModel");
const catchAsync = require("../../utils/catchAsync");

// Controller function to get all tasks
const getAllTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find();
  const taskCount = tasks.length;
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All tasks retrieved successfully!",
    result: taskCount,
    tasks,
  });
});

// Controller function to get all users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  const userCount = users.length;
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All users retrieved successfully!",
    result: userCount,
    users,
  });
});

// Controller function to get all comments
const getAllComments = catchAsync(async (req, res) => {
  const comments = await Comment.find();
  const commentCount = comments.length;
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All comments retrieved successfully!",
    result: commentCount,
    comments,
  });
});

// Controller function to get all notifications
const getAllNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find();
  const notificationCount = notifications.length;
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All notification retrieved successfully!",
    result: notificationCount,
    notifications,
  });
});

// Controller function to get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  const categoryCount = categories.length;
  res
    .status(StatusCodes.OK)
    .json({
      status: "success",
      message: "All categories retrieved successfully!",
      result: categoryCount,
      categories,
    });
});

module.exports = {
  getAllTasks,
  getAllUsers,
  getAllComments,
  getAllNotifications,
  getAllCategories,
};
