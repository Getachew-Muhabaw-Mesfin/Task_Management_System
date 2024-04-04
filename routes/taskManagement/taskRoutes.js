const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskManagement/taskController");
const authMiddleware = require("../../middleware/authMiddleware");

// Middleware to authenticate user
router.use(authMiddleware);


router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Assign a task to a user
router.post("/:id/assign", taskController.assignTask);
router.patch("/:id/complete", taskController.markTaskCompleted);
router.patch("/:id/review", taskController.markTaskReview);
router.get("/Query", taskController.filteredTask);

module.exports = router;
