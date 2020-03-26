import * as query from './paymentInfo.query'
import executor from '../executor'

export default class PaymentInfoDao {

  static insertPaymentInfo (paymentInfo) {
    let {orderId, transactionId, totalAmount, email, contactNumber, deliveryAddress, status, riderId} = paymentInfo;
    let args = [orderId, transactionId, totalAmount, email, contactNumber, deliveryAddress, status, riderId];
    return executor.execute(query.INSERT_PAYMENT_INFO, [args]);
  }

}