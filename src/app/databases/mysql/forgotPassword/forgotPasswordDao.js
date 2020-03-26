import * as query from './forgotPassword.query';
import executor from '../executor';
import {RESET_PASSWORD_TOKEN_VALID_MILL_SECONDS} from '../../../helpers/constants';

/**
 * Forgot Password Dao
 */
export default class ForgotPasswordDao {

  /**
   * Save reset password data into database
   * @param {String} email - email of user
   * @param {String} userId - user id of user
   * @param {String} token - token generated
   * @returns {Promise} Promise
   */
  static saveResetPasswordData(email, userId, token, userType) {
console.log("saveResetPasswordData----------------------------  ");
 console.log(email);

    let addedDate = Date.now();
    let arr = [userId, email, token, userType, addedDate];
    return executor.execute(query.INSERT_FORGOT_PASSWORD_LINK_DATA, arr);
  }

  /**
   * Get valid reset password entry for token and user type
   * @param {String} token - reset password token
   * @param {String} usertype - user type
   * @returns {Promise} Promise
   */
  static getValidEntryByTokenAndUserType(token, usertype) {
	console.log("getValidEntryByTokenAndUserType ----------------------------  ");
	 console.log(token);
	 console.log(usertype);
    let args = [token, usertype, RESET_PASSWORD_TOKEN_VALID_MILL_SECONDS];
    return executor.execute(query.GET_ENTRY_BY_TOKEN_AND_USER_TYPE, args);
  }

  /**
   * Delete entry by token
   * @param {String} token - reset password token
   * @returns {Promise} Promise
   */
  static deleteEntryByToken(token) {
    let args = [token];
    return executor.execute(query.DELETE_ENTRY_BY_TOKEN, args);
  }
}
