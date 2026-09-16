/**
 * Async handler wrapper to catch and forward errors to Express error middleware
 * @param {Function} requestHandler - Express request handler function
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
