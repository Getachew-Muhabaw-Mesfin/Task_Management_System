const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const Category = require("../../models/categoryModel");
const Notification = require("../../models/notificationModel");
const Comment = require("../../models/commentModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// Handle adding comment to task
const addCommentToTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { content } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  const comment = new Comment({
    user: req.user._id,
    content,
    task: taskId,
  });
  await comment.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Comment added successfully",
    comment,
  });
});

// Handle notifying user
const notifyUser = catchAsync(async (req, res, next) => {
  const { taskId, userId, message } = req.body;
  const notification = new Notification({
    user: userId,
    message,
    task: taskId,
  });
  await notification.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Notification sent successfully",
    notification,
  });
});

// Handle sharing task with user
const shareTaskWithUser = catchAsync(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { userId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  if (!task.sharedWith.includes(userId)) {
    task.sharedWith.push(userId);
    await task.save();
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task shared successfully",
    task,
  });
});

// Handle sharing category with user
const shareCategoryWithUser = catchAsync(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const { userId } = req.body;
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
  }
  if (!category.sharedWith.includes(userId)) {
    category.sharedWith.push(userId);
    await category.save();
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Category shared successfully",
    category,
  });
});

module.exports = {
  addCommentToTask,
  notifyUser,
  shareTaskWithUser,
  shareCategoryWithUser,
};
