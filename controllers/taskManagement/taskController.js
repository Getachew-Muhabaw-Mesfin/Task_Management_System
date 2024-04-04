const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/taskModel");

// Crete a new task for a specific user
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Task created successfully",
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

//Get All Tasks for a specific user
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
      msg: "Tasks not retrieved",
      error: error.message,
    });
  }
};

//Get A Single Task
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
      msg: "Task not retrieved",
      error: error.message,
    });
  }
};

// Updated Task
const updateTask = async (req, res) => {
  try {
    // Exclude createdBy field from req.body
    const { createdBy, ...updateFields } = req.body;

    const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
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

// Delete Task only User who created the task can delete it
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id, // Check if task belongs to authenticated user
    });

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


// Assign Task to a user only the user who created the task can assign it to another user
const assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }

    // Check if the current user is the creator of the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        msg: "You are not authorized to assign this task",
      });
    }

    // Update the task with the new assigned user ID
    task.assignedTo = userId;
    await task.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task assigned successfully",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task assignment failed",
      error: error.message,
    });
  }
};


// Mark Task as Completed only the user who created the task can mark it as completed
const markTaskCompleted = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    // Check if the current user is the creator of the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        msg: "You are not authorized to mark this task as completed",
      });
    }

    // Update the task as completed
    task.completed = true;
    await task.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task marked as completed",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task completion failed",
      error: error.message,
    });
  }
};


// Mark Task as Review only the user who created the task can mark it as review
const markTaskReview = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        msg: "You are not authorized to mark this task as review",
      });
    }
    task.review = true;
    await task.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task marked as review",
      task,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Task review failed",
      error: error.message,
    });
  }
};


const filteredTask = async (req, res) => {
  try {
    let filter = { createdBy: req.user._id };
    // Handle filtering based on query parameters
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    const tasks = await Task.find(filter);

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Tasks not retrieved",
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
  filteredTask,
};