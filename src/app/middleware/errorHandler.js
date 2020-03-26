
import {INTERNAL_ERROR} from '../helpers/constants';
import logger from '../../utils/logger';

/**
 * Log errors before sending the error response
 * @param {object} err - Error
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {function} next - call to next middleware
 *
 * @returns {*} call to next middleware
 */
export default function (err, req, res, next) {
    res.locals.message = err.message;
    res.status(err.status || INTERNAL_ERROR);

    logger.error(`${err.status || INTERNAL_ERROR}: ${err.message} \n${err.path} \n${err.causes}`);

    res.json({
        error: err.message
    });
    return next();
}
