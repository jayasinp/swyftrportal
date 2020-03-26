import logger from '../../utils/logger';
import * as constants from './constants';
import passport from '../../passport';
import * as serverConfigs from '../../utils/serverConfigs';
import FileUtils from '../../utils/fileUtils';

export const handleError = function (err, res, statusCode) {
  logger.error(`${err.path} => ${err.message}`);

  statusCode = err.statusCode || statusCode || constants.BAD_REQUEST

  res.status(statusCode).json({
    status: statusCode,
    message: err.customMessage || `Internal server error @  ${new Date().toDateString()}`
  });
};

export const auth = function () {
  return passport.authenticate('token', { session: false });
};


export const sysAuth = function () {
  return passport.authenticate('systoken', { session: false });
}

export const getAffectedRowStatus = function (result) {
  if (result.affectedRows == 0) {
    return {
      status: 404
    };
  } else if (result.affectedRows == 1) {
    return {
      status: 200
    };
  } else {
    return {
      status: 400
    };
  }
}

export const getResult = function (result) {
  if (result.length == 0) {
    return {
      status: 404
    };
  } else {
    return {
      status: 200,
      data: result
    };
  }
}

export const getHost = () => FileUtils.loadConfigs(serverConfigs.CONFIGS["PLATFORM"])['HOST']

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000)