import { catalogService } from '../services/catalog.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCatalogModels = asyncHandler(async (req, res) => {
  const result = await catalogService.getCatalogModels(req.query);
  return res.status(200).json(
    new ApiResponse(200, result, 'Catalog models retrieved successfully')
  );
});

export const getDistinctBrands = asyncHandler(async (req, res) => {
  const brands = await catalogService.getDistinctBrands(req.query);
  return res.status(200).json(
    new ApiResponse(200, brands, 'Distinct catalog brands retrieved successfully')
  );
});

export const getModelsByBrand = asyncHandler(async (req, res) => {
  const { brand } = req.params;
  const { vehicleType } = req.query;
  const models = await catalogService.getModelsByBrand(brand, vehicleType);
  return res.status(200).json(
    new ApiResponse(200, models, `Catalog models for brand '${brand}' retrieved successfully`)
  );
});

export const getCatalogModelByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const model = await catalogService.getCatalogModelByKey(key);
  return res.status(200).json(
    new ApiResponse(200, model, 'Catalog model retrieved successfully')
  );
});

export const getCatalogModelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const model = await catalogService.getCatalogModelById(id);
  return res.status(200).json(
    new ApiResponse(200, model, 'Catalog model retrieved successfully')
  );
});

export const createCatalogModel = asyncHandler(async (req, res) => {
  const newModel = await catalogService.createCatalogModel(req.body);
  return res.status(201).json(
    new ApiResponse(201, newModel, 'Catalog model created successfully')
  );
});

export const updateCatalogModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await catalogService.updateCatalogModel(id, req.body);
  return res.status(200).json(
    new ApiResponse(200, updated, 'Catalog model updated successfully')
  );
});

export const deleteCatalogModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await catalogService.deleteCatalogModel(id);
  return res.status(200).json(
    new ApiResponse(200, deleted, 'Catalog model deactivated successfully')
  );
});
