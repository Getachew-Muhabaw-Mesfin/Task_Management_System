const express = require("express");
const router = express.Router();
const collaborationController = require("../../controllers/taskColabAndComm/taskColabAndCommController");
const authMiddleware = require("../../middleware/authMiddleware");

// Middleware to authenticate user
router.use(authMiddleware);

// Routes for commenting on tasks
router.post("/comment", collaborationController.addCommentToTask);

// Routes for task notifications
router.post("/notify", collaborationController.notifyUser);

// Routes for sharing tasks with users
router.post("/share/task", collaborationController.shareTaskWithUser);

// Routes for sharing categories with users
router.post("/share/category", collaborationController.shareCategoryWithUser);

module.exports = router;
