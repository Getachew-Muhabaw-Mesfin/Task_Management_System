const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers");
const authenticateToken = require("../middleware/authenticateToken");

// Create Task
router.post("/", authenticateToken, taskController.createTask);

// Update Task
router.put("/:id", authenticateToken, taskController.updateTask);

// Delete Task
router.delete("/:id", authenticateToken, taskController.deleteTask);

// Mark Task as Completed
router.put(
  "/:id/complete",
  authenticateToken,
  taskController.markTaskCompleted
);

module.exports = router;
