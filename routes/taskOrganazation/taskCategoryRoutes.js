// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/taskOrganization/taskCategoryController");
// const authMiddleware = require("../../middleware/authMiddleware");

// // Protect routes with authentication middleware
// router.use(authMiddleware);

// Routes
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
