const express = require("express");
const router = express.Router();
const publicApiController = require("../../controllers/publicAPIs/publicAPIsController");

// Routes for getting all tasks, users, comments, notifications, and categories
router.get("/tasks", publicApiController.getAllTasks);
router.get("/users", publicApiController.getAllUsers);
router.get("/comments", publicApiController.getAllComments);
router.get("/notifications", publicApiController.getAllNotifications);
router.get("/categories", publicApiController.getAllCategories);

module.exports = router;
