const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// Create a Task
const createTask = catchAsync(async (req, res, next) => {
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Task created successfully",
    task,
  });
});

// Get all tasks for a specific user
const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Tasks retrieved successfully",
    tasks,
  });
});


// Get Task by Id
const getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task retrieved successfully",
    task,
  });
});

// Update Task
const updateTask = catchAsync(async (req, res, next) => {
  // Exclude createdBy field from req.body
  const { createdBy, ...updateFields } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task updated successfully",
    task,
  });
});

// Delete Task
const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id, // Check if task belongs to authenticated user
  });
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task deleted successfully",
    data: null,
  });
});

// Assign Task to a user only the user who created the task can assign it
const assignTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const { userId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "You are not authorized to assign this task",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  task.assignedTo = userId;
  task.status = "assigned";
  await task.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task assigned successfully",
    task,
  });
});

// Mark Task as Completed only the user who created the task can mark it as completed
const markTaskCompleted = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "You are not authorized to mark this task as completed",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  task.status = "completed";
  await task.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task marked as completed",
    task,
  });
});

      
// Mark Task as Review only the user who created the task can mark it as review
const markTaskReview = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", StatusCodes.NOT_FOUND));
  }
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "You are not authorized to mark this task as review",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  task.status = "review";
  await task.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task marked as review",
    task,
  });
});

// Filter Task by category, priority, status, dueDate
const filteredTask = catchAsync(async (req, res, next) => {
  let filter = { createdBy: req.user._id };
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.dueDate) {
    filter.dueDate = { $gte: new Date(req.query.dueDate) };
  }
  const tasks = await Task.find(filter);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Tasks retrieved successfully",
    tasks,
  });
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  markTaskCompleted,
  markTaskReview,
  filteredTask,
};
