import * as query from './auth.query';
import executor from '../executor';

/**
 * Auth Dao
 */
export default class AuthDao {

  /**
   * Create an login entry for a new user
   * @param {string} userId - user database id
   * @param {string} passwordHash - hashed password
   * @param {string} salt - salt
   * @return {Promise} Promise
   */
  static createAuthEntry(userId, passwordHash, salt) {
    let lastUpdated = Date.now();
    let active = true;
    let args = [userId, passwordHash, salt, lastUpdated, active];

    return executor.execute(query.CREATE_AUTH_ENTRY, [args]);
  }

  /**
   * Get user auth details by email
   * @param {string} email - User's Email address
   * @returns {Promise} Promise
   */
  static getUserPasswordDetails(email) {
    return executor.execute(query.GET_PASSWORD_OF_EMAIL, [email]);
  }

  /**
   * Update password for a new user
   * @param {string} userId - user database id
   * @param {string} passwordHash - hashed password
   * @param {string} salt - salt
   * @return {Promise} Promise
   */
  static updatePasswordOfUser(userId, passwordHash, salt) {
    let lastUpdated = Date.now();
    let args = [passwordHash, salt, lastUpdated, userId];

    return executor.execute(query.UPDATE_PASSWORD_BY_USER_ID, args)
  }

}
