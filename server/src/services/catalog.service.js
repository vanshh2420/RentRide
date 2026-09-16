import VehicleCatalog from '../models/catalog.model.js';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';

class CatalogService {
  /**
   * Query catalog models with filtering, search, and pagination
   */
  async getCatalogModels(queryParams = {}) {
    const {
      search,
      brand,
      category,
      vehicleType,
      fuelType,
      transmission,
      page = 1,
      limit = 20,
      sortBy = 'brand',
      sortOrder = 'asc'
    } = queryParams;

    const filter = { isActive: true };

    if (brand) {
      filter.brand = { $regex: new RegExp(`^${brand.trim()}$`, 'i') };
    }

    if (category) {
      // Find category by slug or ObjectId
      let catDoc = null;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catDoc = await Category.findById(category);
      } else {
        catDoc = await Category.findOne({ slug: category.toLowerCase().trim() });
      }

      if (catDoc) {
        filter.categoryId = catDoc._id;
      }
    }

    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }

    if (fuelType) {
      filter.fuelType = fuelType.toLowerCase();
    }

    if (transmission) {
      filter.transmission = transmission.toLowerCase();
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { brand: { $regex: term, $options: 'i' } },
        { model: { $regex: term, $options: 'i' } },
        { variant: { $regex: term, $options: 'i' } },
        { catalogKey: { $regex: term, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    const order = sortOrder === 'desc' ? -1 : 1;
    if (sortBy === 'brand') {
      sort.brand = order;
      sort.model = 1;
    } else if (sortBy === 'fuelEconomy') {
      sort['fuelEconomy.value'] = order;
    } else if (sortBy === 'price') {
      sort['suggestedPricing.rate24Hour'] = order;
    } else {
      sort[sortBy] = order;
    }

    const [total, models] = await Promise.all([
      VehicleCatalog.countDocuments(filter),
      VehicleCatalog.find(filter)
        .populate('categoryId', 'name slug type iconUrl')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    return {
      models,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get single catalog model by catalogKey
   */
  async getCatalogModelByKey(catalogKey) {
    const model = await VehicleCatalog.findOne({ catalogKey, isActive: true })
      .populate('categoryId', 'name slug type iconUrl')
      .lean();

    if (!model) {
      throw new ApiError(404, `Catalog model with key '${catalogKey}' not found`);
    }

    return model;
  }

  /**
   * Get single catalog model by ObjectId
   */
  async getCatalogModelById(id) {
    const model = await VehicleCatalog.findById(id)
      .populate('categoryId', 'name slug type iconUrl')
      .lean();

    if (!model) {
      throw new ApiError(404, `Catalog model with id '${id}' not found`);
    }

    return model;
  }

  /**
   * Get list of unique brands, optionally filtered by category or vehicleType
   */
  async getDistinctBrands(queryParams = {}) {
    const { category, vehicleType } = queryParams;
    const filter = { isActive: true };

    if (category) {
      const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (catDoc) filter.categoryId = catDoc._id;
    }

    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }

    const brands = await VehicleCatalog.distinct('brand', filter);
    return brands.sort((a, b) => a.localeCompare(b));
  }

  /**
   * Get models for a specific brand (for combobox cascading selection)
   */
  async getModelsByBrand(brand, vehicleType) {
    const filter = {
      brand: { $regex: new RegExp(`^${brand.trim()}$`, 'i') },
      isActive: true
    };
    if (vehicleType) filter.vehicleType = vehicleType;

    const list = await VehicleCatalog.find(filter)
      .select('brand model variant catalogKey categoryId vehicleType fuelType transmission seatingCapacity fuelEconomy specifications features images suggestedPricing')
      .populate('categoryId', 'name slug type')
      .sort({ model: 1, variant: 1 })
      .lean();

    return list;
  }

  /**
   * Admin: Create new catalog model
   */
  async createCatalogModel(data) {
    const existing = await VehicleCatalog.findOne({ catalogKey: data.catalogKey });
    if (existing) {
      throw new ApiError(409, `Catalog model with key '${data.catalogKey}' already exists`);
    }

    const newModel = await VehicleCatalog.create(data);
    return newModel;
  }

  /**
   * Admin: Update catalog model
   */
  async updateCatalogModel(id, data) {
    const model = await VehicleCatalog.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!model) {
      throw new ApiError(404, `Catalog model not found for update`);
    }

    return model;
  }

  /**
   * Admin: Soft delete catalog model
   */
  async deleteCatalogModel(id) {
    const model = await VehicleCatalog.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!model) {
      throw new ApiError(404, `Catalog model not found for deletion`);
    }

    return model;
  }
}

export const catalogService = new CatalogService();
