const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const reportController = require("../../controllers/DashboardReport/reportController");

// Middleware to authenticate user
router.use(authMiddleware);

// Route to generate task completion report
router.get("/rate", reportController.generateTaskCompletionReport);
router.get("/tasks", reportController.getUserTasks);
router.post("/send_email", reportController.sendReportByEmail);

module.exports = router;
