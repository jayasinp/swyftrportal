import Decorator from '../../helpers/decorator';
import OrderFriendReceiveCollectorDao from '../../databases/mysql/friendReceiveCollector/friendReceiveCollectorDao';
import * as Constants from '../../helpers/constants';
import { validatePhone } from '../../helpers/validateUtils';
import OrderModel from '../order/orderModel';
/**
 * OrderFriendReceiveCollector Model
 */
class OrderFriendReceiveCollectorModel extends Decorator {

  constructor () {
    super();
  }

  create (body) {
    return new Promise((resolve, reject) => {
      if (!body.riderId) {
        let err = new Error('Empty Rider Id')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      if (!body.orderId) {
        let err = new Error('Empty Order Id')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      if (!body.signature) {
        let err = new Error('Empty signature')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      if (!body.collectorName) {
        let err = new Error('Empty Collector Name')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      if (!body.collectorContact || !validatePhone(body.collectorContact)) {
        let err = new Error('Invalid Collector Contact')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      if (!body.collectorNIC) {
        let err = new Error('Empty Collector NIC')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
        return reject(err)
      }

      OrderModel.changeOrderStatusAfterFriendReceive(body.orderId, "DELI").then(() => {
        OrderFriendReceiveCollectorDao.insert(body).then(() => {
          resolve({
            status: Constants.SUCCESS
          })
        }).catch((error) => {
          if(error.code === "ER_DUP_ENTRY") {
            let err = new Error('Order Already Collected')
            err.customMessage = err.message
            err.appendDetails('OrderFriendReceiveCollectorModel', 'create')
            return reject(err)
          }
          return reject(error);
        })
      }).catch((error) => reject(error));
    });
  }

}

export default new OrderFriendReceiveCollectorModel();
