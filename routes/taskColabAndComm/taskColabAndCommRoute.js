const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskColabAndComm/taskColabAndCommController");
const authMiddleware = require("../../middleware/authMiddleware");

// Middleware to authenticate user
router.use(authMiddleware);

router.post("/tasks/:taskId/comments", taskController.addCommentToTask);
router.post("/notifications", taskController.notifyUser);
router.post("/tasks/:taskId/share", taskController.shareTaskWithUser);
router.post(
  "/categories/:categoryId/share",
  taskController.shareCategoryWithUser
);

module.exports = router;
