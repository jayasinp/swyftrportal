import * as query from './order.query'
import executor from '../executor'

export default class OrderDao {

  static insertOrder (order) {
    let {orderAddress, customer, deliveryRequired, orgId, branchId, latitude, longitude, 
      deliveryDate, deliveryETA, deliveryCost, deliveryContactNumber, writtenAddress, paymentStatus} = order
    let orderDate = Date.now()
    let args = [orderAddress, customer, deliveryRequired, orderDate, 'INIT', orgId, branchId, 
    latitude, longitude, deliveryDate, deliveryETA, deliveryCost, deliveryContactNumber, writtenAddress, paymentStatus];
    return executor.execute(query.INSERT_ORDER, [args])
  }

  static insertItems (items) {
    return executor.execute(query.INSERT_ORDER_ITEMS, [items]);
  }

  static updateOrder (order) {
    let {orderAddress, customer, deliveryRequired, orderId, orgId, branchId, 
      latitude, longitude, deliveryDate, deliveryETA, deliveryCost, deliveryContactNumber, writtenAddress} = order
    let orderDate = Date.now()
    let args = [orderAddress, customer, deliveryRequired, orderDate, 'INIT', orgId, branchId,
      latitude, longitude, deliveryDate, deliveryETA, deliveryCost, deliveryContactNumber, writtenAddress, orderId]
    return executor.execute(query.UPDATE_ORDER, args)
  }

  static deleteOrderItems (orderId) {
    return executor.execute(query.DELETE_ORDER_ITEMS, [orderId])
  }

  static deleteOrder (orderId) {
    return executor.execute(query.DELETE_ORDER, [orderId])
  }

  static getOrderByCustomer (customer) {
    return executor.execute(query.GET_ORDER_BY_CUSTOMER, [customer])
  }

  static getOrderById (id, customerId) {
    let q = query.GET_ORDER_BY_ID;
    let args = [id]

    if (customerId) {
      q += " AND customer=?";
      args.push(customerId)
    }

    return executor.execute(q, args)
  }

  static getOrderItems (orderId) {
    return executor.execute(query.GET_ORDER_ITEMS, [orderId])
  }

  static getOrderQRSalt (orderId) {
    return executor.execute(query.GET_QR_SALT, [orderId])
  }

  static updateOrderStatus (id, status) {
    return executor.execute(query.UPDATE_ORDER_STATUS, [status, id])
  }

  static updateOrderRiderPickedStatus (id, status) {
    return executor.execute(query.UPDATE_ORDER_RIDER_PICKED_STATUS, [status, id])
  }

  static updateOrderCustomerPickedStatus (id, status) {
    return executor.execute(query.UPDATE_ORDER_CUSTOMER_PICKED_STATUS, [status, id])
  }

  static updateOrderQR (qr, qrSalt, id) {
    return executor.execute(query.UPDATE_ORDER_QR, [qr, qrSalt, id])
  }

  static getOrdersAndCustomerByRiderIdAndStatus (riderId, statusArr) {
    let args = [riderId, statusArr]
    return executor.execute(query.GET_ORDER_AND_CUSTOMER_BY_RIDER_AND_STATUS, args)
  }

  static getAllOrders(orgId, branchId, status) {
    return executor.execute(query.INCREASE_GROUP_CONCAT_SIZE, []).then(()=> {
      let q = query.GET_ALL_ORDERS;
      let args = [];
      if (orgId && status) {
        q += "WHERE O.org_id=? AND O.status=? ";
        args = [orgId, status];
      } else if (orgId && !status) {
        q += "WHERE O.org_id=? ";
        args = [orgId];
      } else if (!orgId && status) {
        q += "WHERE O.status=? ";
        args = [status]
      }

      if (branchId !== null && branchId !== '') {
        q += 'AND O.branch_id=? ';
        args.push(branchId)
      }

      q += "GROUP BY O.id";

      return executor.execute(q, args);
    });
  }

  static getOrderInfoForAdminById(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_ORDER_INFO_BY_ID_FOR_ADMIN, args);
  }

  static getOrderCustomerDetailsByOrderId(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_ORDER_CUS_DETAILS, args);
  }

  static reAddOrderStock(stockId, addQty) {
    const args = [addQty, stockId];
    return executor.execute(query.RE_ADD_TO_STOCK, args);
  }

  static updateRiderForOrder(orderId, rider) {
    const args = [rider, orderId];
    return executor.execute(query.UPDATE_RIDER_ID, args);
  }

  static getOrdersByRiderAndStatus(rider, statusArr) {
    const args = [rider, statusArr];
    return executor.execute(query.GET_ORDERS_OF_RIDER_BY_STATUS, args)
  }

  static updateOrderConsent(orderId, riderId) {
    const args = [orderId, riderId];
    return executor.execute(query.UPDATE_RIDER_CONSENT, args)
  }

  static assignRiderManually(riderId, orderId) {
    const args = [riderId, orderId]
    return executor.execute(query.SET_RIDER_MANUALLY, args)
  }

  static getOrdersInStatusArr(statusArr) {
    const args = [statusArr]
    return executor.execute(query.GET_ORDERS_IN_STATUS_ARRAY, args)
  }

  static getOrderInfoForEmail(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_ORDER_FOR_EMAIL, args);
  }

  static getOrderItemsForEmail(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_ORDER_ITEMS_FOR_EMAIL, args);
  }

  static getRiderIdByOrderId(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_RIDER_BY_ORDER_ID, args);
  }
}