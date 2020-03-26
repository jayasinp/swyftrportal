import * as query from './friendReceiveCollector.query';
import executor from '../executor';

/**
 * FriendReceiveCollector Dao
 */
export default class FriendReceiveCollectorDao {

  /**
   * Insert new FriendReceiveCollector entry
   * @param {object} receiverDetails - FriendReceiveCollector entry
   * @returns {Promise} Promise
   */
  static insert(receiverDetails) {
    let {riderId, orderId, signature, collectorName, 
      collectorContact, collectorNIC} = receiverDetails;
    let args = [riderId, orderId, signature, collectorName, 
      collectorContact, collectorNIC];

    return executor.execute(query.INSERT_ORDER_FRIEND_RECEIVE_COLLECTOR, [args]);
  }
}
