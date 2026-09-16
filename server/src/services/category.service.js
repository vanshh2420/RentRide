import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';

export class CategoryService {
  /**
   * Get all categories (Public / Admin)
   */
  static async getAllCategories(includeInactive = false) {
    const query = includeInactive ? {} : { isActive: true };
    return await Category.find(query).sort({ name: 1 });
  }

  /**
   * Get single category by ID or Slug
   */
  static async getCategoryByIdOrSlug(idOrSlug) {
    let category;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  /**
   * Create new category (Admin)
   */
  static async createCategory(categoryData) {
    const existing = await Category.findOne({ name: categoryData.name.trim() });
    if (existing) {
      throw new ApiError(409, `Category '${categoryData.name}' already exists`);
    }

    return await Category.create(categoryData);
  }

  /**
   * Update category (Admin)
   */
  static async updateCategory(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    return category;
  }

  /**
   * Delete category (Admin)
   */
  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }
}
