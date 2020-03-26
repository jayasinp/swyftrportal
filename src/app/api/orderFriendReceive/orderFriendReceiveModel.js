import Decorator from '../../helpers/decorator';
import OrderFriendReceiveDao from '../../databases/mysql/orderFriendReceive/orderFriendReceiveDao';
import * as Constants from '../../helpers/constants';
/**
 * OrderFriendReceive Model
 */
class OrderFriendReceiveModel extends Decorator {

  constructor () {
    super();
  }

  createOrderFriendReceive (order, orderId) {
    return new Promise((resolve, reject) => {
      if (!order.name) {
        let err = new Error('Empty Receiver\'s name')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveModel', 'createOrderFriendReceive')
        return reject(err)
      }

      if (!order.address) {
        let err = new Error('Empty Address')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveModel', 'createOrderFriendReceive')
        return reject(err)
      }

      if (!order.phone) {
        let err = new Error('Empty Phone')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveModel', 'createOrderFriendReceive')
        return reject(err)
      }

      if (!orderId) {
        let err = new Error('Empty Order Id')
        err.customMessage = err.message
        err.appendDetails('OrderFriendReceiveModel', 'createOrderFriendReceive')
        return reject(err)
      }
      order.orderId = orderId;
      OrderFriendReceiveDao.insert(order).then((result) => {
        let userId = result['insertId'];
        resolve({
          status: Constants.SUCCESS,
          userId: userId
        })
      }).catch(reject);

    });
  }

  getOrderFriendDetailsByOrderId(orderId) {
    return new Promise((resolve, reject)=>{
      if (!orderId) {
        let err = new Error("Order Id Required");
        err.customMessage = err.message;
        err.appendDetails("OrderFriendReceive Model", "getOrderFriendDetailsByOrderId");
        return reject(err);
      }

      OrderFriendReceiveDao.getOrderFriendReceiveByOrderId(orderId).then((rows)=> resolve({
        status: 200,
        orderFriend: this._buildUserDetails(rows)[0]
      })).catch(reject);
    })
  }

  _buildUserDetails(dbArray) {
    let list = [];  
    for(let dbObject of dbArray){
      let user = {
        name: dbObject.name,
        address: dbObject.address,
        phone: dbObject.phone
      };
      list.push(user);
    }    
    return list;
  }

}

export default new OrderFriendReceiveModel();
