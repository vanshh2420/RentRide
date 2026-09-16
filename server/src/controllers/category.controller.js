import { CategoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const categories = await CategoryService.getAllCategories(includeInactive);
  return res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched successfully'));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryByIdOrSlug(req.params.id);
  return res.status(200).json(new ApiResponse(200, { category }, 'Category fetched successfully'));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body);
  return res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.updateCategory(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { category }, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.deleteCategory(req.params.id);
  return res.status(200).json(new ApiResponse(200, { category }, 'Category deleted successfully'));
});
