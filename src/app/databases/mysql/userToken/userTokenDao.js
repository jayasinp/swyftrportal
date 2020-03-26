import * as query from './userToken.query';
import executor from '../executor';
import * as constants from '../../../helpers/constants';

/**
 * User Token Dao
 */
export default class UserTokenDao {

  /**
   * Insert a new token to database
   * @param {string} userId - User id
   * @param {string} token - access token
   * @param {string} refreshToken - refresh token
   * @returns {Promise} Promise
   */
  static insertToken(userId, token, refreshToken) {
    let validTill = Date.now() + constants.TOKEN_VALID_PERIOD_MS;
    let active = 1;
    let args = [userId, token, validTill, active, refreshToken];
    return executor.execute(query.INSERT_TOKEN, [args]);
  }

  /**
   * Invalidate all tokens for a given user
   * @param {string} userId - user id of the user
   * @returns {Promise} Promise
   */
  static invalidateTokensForUser(userId) {
    let args = [userId];
    return executor.execute(query.INVALIDATE_TOKENS_OF_A_USER, args);
  }

  /**
   * Get active token of user by user name
   * @param {string} userName - user name
   * @returns {Promise} promise
   */
  static getActiveTokenByUserName(userName) {
    let args = [userName];
    return executor.execute(query.GET_ACTIVE_TOKEN_BY_USER_NAME, args);
  }

}
