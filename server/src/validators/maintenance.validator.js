import { z } from 'zod';

export const scheduleMaintenanceSchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    title: z.string().min(3, 'Title/Reason is required'),
    serviceType: z.enum([
      'OIL_CHANGE',
      'TIRE_ROTATION',
      'BRAKE_INSPECTION',
      'GENERAL_SERVICE',
      'ACCIDENT_REPAIR',
      'EMERGENCY'
    ]),
    startDate: z.string().datetime({ message: 'Valid ISO start date is required' }),
    endDate: z.string().datetime({ message: 'Valid ISO end date is required' }),
    estimatedCost: z.coerce.number().min(0).default(0),
    notes: z.string().optional()
  })
};

export const completeMaintenanceSchema = {
  body: z.object({
    actualCost: z.coerce.number().min(0, 'Actual cost is required'),
    serviceCenterName: z.string().optional(),
    invoiceNumber: z.string().optional(),
    notes: z.string().optional()
  })
};
