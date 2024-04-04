const { StatusCodes } = require("http-status-codes");
const Category = require("../../models/categoryModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// Create a category
const createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  const category = await Category.create({ name, description, user: userId });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    msg: "Category created successfully",
    category,
  });
});

// Get all categories
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ user: req.user._id });
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Categories retrieved successfully",
    categories,
  });
});

// Get a category by id
const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Category retrieved successfully",
    category,
  });
});

// Update a category
const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Category updated successfully",
    category,
  });
});

// Delete a category
const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    msg: "Category deleted successfully",
    data: null,
  });
});
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
