// categoryController.js
const { StatusCodes } = require("http-status-codes");
const Category = require("../../models/categoryModel");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id; // Assuming user ID is available in the request
    const category = await Category.create({ name, description, user: userId });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Category not created",
      error: error.message,
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Categories not retrieved",
      error: error.message,
    });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Category not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Category not retrieved",
      error: error.message,
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Category not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Category not updated",
      error: error.message,
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "Category not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Category deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "Category not deleted",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
