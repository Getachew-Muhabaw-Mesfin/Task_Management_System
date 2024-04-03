const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskManagement/taskController");
// const checkAuth = require("../../middleware/authMiddleware");

// // Middleware to protect routes (requires authentication)
// router.use(checkAuth);

// Task Routes
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route("/:id/assign").put(taskController.assignTask);

router.route("/:id/complete").put(taskController.markTaskCompleted);

router.route("/:id/review").put(taskController.markTaskReview);

module.exports = router;
