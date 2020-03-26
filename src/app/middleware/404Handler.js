import { NOT_FOUND, NOT_FOUND_INDEX } from '../helpers/constants';

/**
 * Catch 404 and forward to error handler
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {function} next - call to next middleware
 */
export default function middleware(req, res, next) {
  if (req.method === 'GET' && req.url.indexOf('/api/v1') === NOT_FOUND_INDEX) {
    return res.redirect('/')
  }

  let err = new Error('Resource Not Found');
  err.status = NOT_FOUND;
  err.appendDetails("404Handler", "404middleware");
  next(err);
}
