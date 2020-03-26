import * as Constants from './constants';
import * as util from './utility';
import UserModel from '../api/user/userModel';
import RiderModel from '../api/rider/riderModel';

export function validateEmail(email) {
    let re = Constants.EMAIL_REGEX;
    return re.test(email);
  }

  export function validatePhone(phone) {
    let re = Constants.SL_PHONE_REGEX;
    return re.test(phone);
  }

export function riderPartnerAdminValidationMiddleware(req, res, next) {
  const reqUser = req.user;
  UserModel._validateRiderPartnerAdmin(reqUser).then(next).catch(
    (err) => util.handleError(err, res, Constants.FORBIDDEN)
  )
}

export function riderValidationMiddleware(req, res, next) {
  const email = req.headers['x-username'];
  RiderModel.__validateForRider(email).then(next).catch(
    (err) => util.handleError(err, res, Constants.FORBIDDEN)
  )
}