import * as query from './profile.query';
import executor from '../executor';

/**
 * Profile DAO
 */
export default class ProfileDao {

  /**
   * Insert a profile to database
   * @param {Object} profile - profile object
   * @return {Promise} promise
   */
  static createProfile(profile) {
    let {firstName, lastName, email, nic, mobileNo, phoneNo, dateOfBirth, profilePicId, otp, otpRetryCount} = profile;
    let addedDate = Date.now();
    let args = [firstName, lastName, dateOfBirth, email, phoneNo, mobileNo, nic, addedDate, profilePicId, otp, otpRetryCount];
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
    if(nic)
      return executor.execute(query.CHECK_USER_EXIST_NIC_CHECK, args);
    
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
    let {userId, firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, profilePicId} = user;
    let args = [firstName, lastName, dateOfBirth, phoneNumber, mobileNumber, profilePicId, userId];

    return executor.execute(query.UPDATE_USER_BY_USER_ID, args);
  }

  static updateDeviceId(userId, deviceId, deviceOs) {
    let args = [deviceId, deviceOs, userId];
    return executor.execute(query.UPDATE_DEVICE_ID_BY_USER_ID, args);
  }

  static getAllCustomersByStatus(status) {
    let args = [status];
    return executor.execute(query.GET_ALL_CUSTOMERS_BY_STATUS, args);
  }

  static changeStatusOfCustomerByUserId(userId, status) {
    const args = [status, userId];
    return executor.execute(query.CHANGE_CUSTOMER_STATUS, args);
  }

  static updateOTP(userId, otp) {
    let args = [otp, userId];
    return executor.execute(query.UPDATE_OTP, args);
  }

  static updateOTPCount(userId, otpCount) {
    let args = [otpCount, userId];
    return executor.execute(query.UPDATE_OTP_COUNT, args);
  }

}
