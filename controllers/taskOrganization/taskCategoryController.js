// controllers/categoryController.js
const Category = require("../../models/categoryModel");
const { StatusCodes } = require("http-status-codes");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user; // Assuming the user is authenticated and attached to the request
    const newCategory = await Category.create({
      name,
      description,
      user: user._id,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ status: "success", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Unable to create category" });
  }
};

// Get all categories for a user
const getCategories = async (req, res) => {
  try {
    const user = req.user; // Assuming the user is authenticated and attached to the request
    const categories = await Category.find({ user: user._id });
    res.status(StatusCodes.OK).json({ status: "success", data: categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Unable to get categories" });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", message: "Category not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Unable to update category" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", message: "Category not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Unable to delete category" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
