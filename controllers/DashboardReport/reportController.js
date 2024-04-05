const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// Generate task completion report
const generateTaskCompletionReport = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const pendingTasks = await Task.countDocuments({
    createdBy: userId,
    status: "pending",
  });
  const assignedTasks = await Task.countDocuments({
    createdBy: userId,
    status: "assigned",
  });
  const reviewTasks = await Task.countDocuments({
    createdBy: userId,
    status: "review",
  });
  const completedTasks = await Task.countDocuments({
    createdBy: userId,
    status: "completed",
  });
  const overdueTasks = await Task.countDocuments({
    createdBy: userId,
    status: "overdue",
  });

  //Calculate completion rates for each status
  const totalTasks =
    pendingTasks + assignedTasks + reviewTasks + completedTasks + overdueTasks;
  const completionRates = {
    pending: (pendingTasks / totalTasks) * 100,
    assigned: (assignedTasks / totalTasks) * 100,
    review: (reviewTasks / totalTasks) * 100,
    completed: (completedTasks / totalTasks) * 100,
    overdue: (overdueTasks / totalTasks) * 100,
  };

  // Prepare report data
  const reportData = {
    totalTasks,
    completionRates,
  };
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Task completion report generated successfully",
    reportData,
  });
});

// Get user tasks
const getUserTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user._id }).populate(
    "category"
  );
  const today = new Date();
  const upcomingTasks = tasks.filter((task) => task.dueDate > today);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User dashboard data retrieved successfully",
    tasks: upcomingTasks,
  });
});


module.exports = {
  generateTaskCompletionReport,
  getUserTasks,
};
