// categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/taskOrganization/taskCategoryController");
const checkAuth = require("../../middleware/authMiddleware");

// check Auth middleware is used to protect the routes
router.use(checkAuth);

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
