/**
 * Express middleware for validating request body, query, or params using Zod
 * @param {import('zod').ZodSchema} schema - Zod schema object with optional body, query, params keys
 */
export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    next();
  } catch (error) {
    next(error);
  }
};
