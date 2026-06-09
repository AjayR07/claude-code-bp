/* eslint-disable no-unused-vars */
// Express identifies error-handling middleware by its four arguments, so `next`
// must stay in the signature even though it is unused here.
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
