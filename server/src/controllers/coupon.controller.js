import { CouponService } from '../services/coupon.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponService.createCoupon(req.body, req.user._id);
  return res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created successfully'));
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const { isActive, page, limit } = req.query;
  const result = await CouponService.getAllCoupons({ isActive, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Coupons fetched successfully'));
});

export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await CouponService.getCouponById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon fetched successfully'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponService.updateCoupon(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon updated successfully'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const result = await CouponService.deleteCoupon(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'Coupon deleted successfully'));
});

export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const coupon = await CouponService.toggleCouponStatus(req.params.id);
  return res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon status updated successfully'));
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, bookingAmount } = req.body;
  const result = await CouponService.validateCoupon(code, bookingAmount, req.user?._id);
  return res.status(200).json(new ApiResponse(200, result, 'Coupon is valid'));
});
