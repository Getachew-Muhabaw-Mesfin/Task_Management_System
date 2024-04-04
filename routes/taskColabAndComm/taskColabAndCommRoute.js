const express = require("express");
const router = express.Router();
const collaborationController = require("../../controllers/taskColabAndComm/taskColabAndCommController");
const authMiddleware = require("../../middleware/authMiddleware");

// Middleware to authenticate user
router.use(authMiddleware);

router.post("/comment", collaborationController.addCommentToTask);
router.post("/notify", collaborationController.notifyUser);
router.post("/share/task", collaborationController.shareTaskWithUser);
router.post("/share/category", collaborationController.shareCategoryWithUser);

module.exports = router;
