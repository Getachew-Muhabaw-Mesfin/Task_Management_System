const  Task  = require("../../models/task");
const { StatusCodes } = require("http-status-codes");

// Create Task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const createdBy = req.user.userId;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy,
    });
    await newTask.save();

    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Internal server error",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, assignedTo, completed } =
    req.body;
  const updatedTask = {
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    completed,
  };

  try {
    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
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
    console.error("Error updating task:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Internal server error",
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Task not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Internal server error",
    });
  }
};

// Mark Task as Completed
const markTaskCompleted = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { completed: true, completedAt: Date.now() },
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
    console.error("Error marking task as completed:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Internal server error",
    });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  markTaskCompleted,
};
