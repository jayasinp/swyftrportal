import * as query from './userAddress.query';
import executor from '../executor';

/**
 * User Address DAO
 */
export default class UserAddressDao {

  /**
   * Create user address entry
   *
   * @param {Object} address - address object
   * @param {userId} userId - users database id
   * @returns {Promise} promise
   */
  static createUserAddress(address, userId) {
console.log(" createUserAddress")
console.log(address)
console.log(userId)

    let {addressLine1, addressLine2, district, province} = address;
    let lastUpdate = Date.now();
    let args = [addressLine1, addressLine2, district, province, userId, lastUpdate];

    return executor.execute(query.CREATE_USER_ADDRESS, [args]);
  }

  /**
   * Get all address for a user by user id
   * @param {string} userId - database id of a user
   * @returns {Promise} promise
   */
  static getAddressByUserId(userId) {
    let args = [userId];

    return executor.execute(query.GET_USER_BY_USER_ID, args);
  }

  /**
   * Update user address entry
   *
   * @param {Object} address - address object
   * @returns {Promise} promise
   */
  static updateAddressByUserId(address) {
console.log("address")
console.log(address)

    let {address_line_1, address_line_2, district, province, userId} = address;
    let lastUpdate = Date.now();
    let args = [address_line_1, address_line_2, district, province, lastUpdate, userId];
console.log("args")
console.log(args)

    return executor.execute(query.UPDATE_USER_ADDRESS_ByUId, args);
  }

  /**
   * Get address by address id
   *
   * @param {string} addressId - users address id
   * @returns {Promise} promise
   */
  static getAddressByAddressId(addressId) {
    let args = [addressId];
    return executor.execute(query.GET_USER_BY_ADDRESS_ID, args);
  }


/**
   * Get address by address id
   *
   * @param {string} addressId - users address id
   * @returns {Promise} promise
   */
  static getAddressByUserId(userId) {

console.log("userId")
console.log(userId)
    let args = [userId];
    return executor.execute(query.GET_ADDRESS_BY_USER_ID, args);
  }

  /**
   * Remove address by address id
   *
   * @param {string} addressId - users address id
   * @returns {Promise} promise
   */
  static removeAddressByAddressId(addressId) {
    let args = [addressId];
    return executor.execute(query.REMOVE_ADDRESS_BY_ADDRESS_ID, args);
  }

}
