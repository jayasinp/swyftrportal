import * as query from './orderFriendReceive.query';
import executor from '../executor';

/**
 * OrderFriendReceive Dao
 */
export default class OrderFriendReceiveDao {

  /**
   * Insert new OrderFriendReceive entry
   * @param {object} userDetails - OrderFriendReceive entry
   * @returns {Promise} Promise
   */
  static insert(userDetails) {
    let {name, address, phone, orderId} = userDetails;
    let args = [name, address, phone, orderId];

    return executor.execute(query.INSERT_ORDER_FRIEND_RECEIVE, [args]);
  }

  /**
   * Get Order Friend by id
   * @param {string} id - id
   * @returns {Promise} promise
   */
  static getOrderFriendReceiveById(id) {
    let args = [id];
    return executor.execute(query.SELECT_ORDER_FRIEND_RECEIVE, args);
  }

  /**
   * Get Order Friend by order id
   * @param {string} orderId - id
   * @returns {Promise} promise
   */
  static getOrderFriendReceiveByOrderId(orderId) {
    let args = [orderId];
    return executor.execute(query.SELECT_ORDER_FRIEND_RECEIVE_BY_ORDER_ID, args);
  }

  /**
   * Update OrderFriendReceive details
   * @param {object} userDetails - update details
   * @param {number} id - id
   * @returns {Promise} Promise
   */
  static update(userDetails, id) {
    let {name, address, phone, orderId} = userDetails;
    let args = [name, address, phone, orderId, id];
    return executor.execute(query.UPDATE_ORDER_FRIEND_RECEIVE, args);
  }

  /**
   * Delete OrderFriendReceive details
   * @param {number} id - id
   * @returns {Promise} Promise
   */
  static delete(id) {
    let args = [id];
    return executor.execute(query.DELETE_ORDER_FRIEND_RECEIVE, args);
  }

   /**
   * Delete OrderFriendReceive By Order Id details
   * @param {number} id - id
   * @returns {Promise} Promise
   */
  static deleteByOrderId(orderId) {
    let args = [orderId];
    return executor.execute(query.DELETE_ORDER_FRIEND_RECEIVE_BY_ORDER_ID, args);
  }
}
