import { ApiError } from '../utils/ApiError.js';

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - Array of roles permitted to access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before permission check'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

export { authorize as authorizeRoles };
