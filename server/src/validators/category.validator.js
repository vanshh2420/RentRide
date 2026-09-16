import { z } from 'zod';

export const createCategorySchema = {
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').max(50),
    type: z.enum(['two_wheeler', 'four_wheeler'], {
      required_error: 'Type must be either two_wheeler or four_wheeler'
    }),
    iconUrl: z.string().url('Invalid icon URL').optional().or(z.literal('')),
    description: z.string().max(300).optional(),
    isActive: z.boolean().default(true)
  })
};

export const updateCategorySchema = {
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    type: z.enum(['two_wheeler', 'four_wheeler']).optional(),
    iconUrl: z.string().url().optional().or(z.literal('')),
    description: z.string().max(300).optional(),
    isActive: z.boolean().optional()
  })
};
