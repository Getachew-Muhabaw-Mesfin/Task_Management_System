const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const Category = require("../../models/categoryModel");
const Notification = require("../../models/notificationModel");
const Comment = require("../../models/commentModel");

// Handle commenting on tasks
const addCommentToTask = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    const comment = new Comment({
      user: req.user._id,
      content,
      task: taskId,
    });
    await comment.save();
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Failed to add comment",
      error: error.message,
    });
  }
};

// Handle task notifications
const notifyUser = async (req, res) => {
  try {
    const { taskId, userId, message } = req.body;
    const notification = new Notification({
      user: userId,
      message,
      task: taskId,
    });
    await notification.save();
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Failed to send notification",
      error: error.message,
    });
  }
};

// Handle sharing task with user
const shareTaskWithUser = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    if (!task.sharedWith.includes(userId)) {
      task.sharedWith.push(userId);
      await task.save();
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task shared successfully",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Failed to share task",
      error: error.message,
    });
  }
};

// Handle sharing category with user
const shareCategoryWithUser = async (req, res) => {
  try {
    const { categoryId, userId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Category not found",
      });
    }
    if (!category.sharedWith.includes(userId)) {
      category.sharedWith.push(userId);
      await category.save();
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Category shared successfully",
      category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Failed to share category",
      error: error.message,
    });
  }
};

module.exports = {
  addCommentToTask,
  notifyUser,
  shareTaskWithUser,
  shareCategoryWithUser,
};
