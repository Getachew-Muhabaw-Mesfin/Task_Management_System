const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskManagement/taskController");
const authMiddleware = require("../../middleware/authMiddleware");
// Middleware to authenticate user
router.use(authMiddleware);

//CRUD Routes for tasks
router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

//Operations Specific to task routes
router.patch("/:id/assign", taskController.assignTask);
router.patch("/:id/complete", taskController.markTaskCompleted);
router.patch("/:id/review", taskController.markTaskReview);
router.get("", taskController.filteredTask);

module.exports = router;
