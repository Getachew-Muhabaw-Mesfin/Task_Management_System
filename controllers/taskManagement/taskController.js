const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Task created successfully1",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not created",
      error: error.message,
    });
  }
};

// Get all tasks created by the user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      task: "Tasks not retrieved",
      error: error.message,
    });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      task: "Task not retrieved",
      error: error.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not updated",
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not deleted",
      error: error.message,
    });
  }
};

// Assign a task to a user
const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    );
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      task,
      msg: "Task assigned successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not assigned",
      error: error.message,
    });
  }
};

// Mark a task as completed
const markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task marked as completed",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not marked as completed",
      error: error.message,
    });
  }
};

// Mark a task for review
const markTaskReview = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { review: true },
      { new: true }
    );
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      task,
      msg: "Task marked for review",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task not marked for review",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  markTaskCompleted,
  markTaskReview,
};
