import * as query from './sysUserProfile.query';
import executor from '../executor';

/**
 * System User Profile DAO
 */
export default class SysUserProfileDao {

  /**
   * Insert a system user profile to database
   * @param {Object} profile - profile object
   * @return {Promise} promise
   */
  static createProfile(profile) {
    let {firstName, lastName, email, nic, mobileNo, phoneNo, userType,
      dateOfBirth, address, orgId, designation, profilePicId} = profile;
    let addedDate = Date.now();
    let args = [firstName, lastName, dateOfBirth, email, phoneNo, mobileNo, userType, nic, addedDate, address, orgId, designation, profilePicId];

    return executor.execute(query.CREATE_PROFILE, [args]);
  }

  /**
   * Check user exists by given email, nic or mobile number
   * @param {string} email - email address
   * @param {string} mobile - mobile number
   * @param {string} nic - nic number
   * @returns {Promise} promise
   */
  static checkUserExists(email, mobile, nic) {
    let args = [email, mobile, nic];
    return executor.execute(query.CHECK_USER_EXIST, args);
  }

  /**
   * Get user by email or user id
   * @param {string} userId - user id
   * @param {string} email - user's email
   * @returns {Promise} promise
   */
  static getUserByEmailOrUserId(userId, email) {
    let args = [email, userId];
    return executor.execute(query.GET_USER_BY_ID_OR_EMAIL, args);
  }

  /**
   * Update by user by user id
   * @param {object} user - user update object
   * @returns {Promise} promise
   */
  static updateUserByUserId(user) {
    let {userId, firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, address, designation, profilePicId, branchId} = user;
    let args = [firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, address, designation, profilePicId, branchId, userId];

    return executor.execute(query.UPDATE_USER_BY_USER_ID, args);
  }

  /**
   * Update by user by email
   * @param {object} user - user update object
   * @returns {Promise} promise
   */
  static updateUserByEmail(user) {
    let {email, firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, address, designation, profilePicId, branchId} = user;
    let args = [firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, address, designation, profilePicId, branchId, email];

    return executor.execute(query.UPDATE_USER_BY_EMAIL, args);
  }

  /**
   * Get all users in db
   * @returns {Promise} promise
   */
  static getAllUsers(active, orgId) {
    //"ORDER BY first_name, last_name ASC"
    let q = query.GET_ALL_USERS;
    let args = [];

    if (active === 'true') {
      q += "INNER JOIN SYS_AUTH A ON A.sys_user_id = P.user_id WHERE A.active=1 "
      if (orgId) {
        q += " AND P.org_id = ?";
        args.push(orgId)
      }
    } else if (active === 'false') {
      q += "INNER JOIN SYS_AUTH A ON A.sys_user_id = P.user_id WHERE A.active=0 "
      if (orgId) {
        q += " AND P.org_id = ?";
        args.push(orgId)
      }
    } else {
      if (orgId) {
        q += " WHERE P.org_id = ?";
        args.push(orgId)
      }
    }

    return executor.execute(q, args);
  }

  /**
   * Change user active status between active and deactive
   * @param {string} userId - user id
   * @param {boolean} active - user active status
   * @returns {Promise} promise
   */
  static changeUserActiveStatus (userId, active) {
    let args = [active, userId];
    return executor.execute(query.CHANGE_USER_ACTIVE_STATUS, args);
  }

  static getAllRiderUsersForPartner(ordId) {
    let args = [ordId];
    return executor.execute(query.GET_RIDERS_BY_ORG_ID, args);
  }

}
