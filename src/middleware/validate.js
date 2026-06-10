import { ValidationError } from '../errors/AppError.js';

/**
 * Reusable validation middleware factory.
 *
 * Wraps a validation function in an Express middleware so route files stay
 * free of try/catch boilerplate. The validator receives the request body and
 * an options object; it returns { value, errors }.
 *
 * Usage:
 *   router.post('/', validate(validateTask), controller.create);
 *   router.put('/:id', validate(validateTask, { partial: true }), controller.update);
 *
 * @param {Function} validatorFn  (body, opts) => { value, errors }
 * @param {object}  [opts={}]     Extra options forwarded to validatorFn
 * @returns {import('express').RequestHandler}
 */
export function validate(validatorFn, opts = {}) {
  return (req, res, next) => {
    const { value, errors } = validatorFn(req.body, opts);
    if (errors.length > 0) {
      return next(new ValidationError(errors));
    }
    // Attach the cleaned, type-coerced value so the controller never touches req.body directly
    req.validated = value;
    next();
  };
}
