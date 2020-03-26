import Decorator from '../../helpers/decorator';
import PaymentInfoDao from '../../databases/mysql/paymentInfo/paymentInfoDao';
import * as Constants from '../../helpers/constants';
import * as ValidateUtils from '../../helpers/validateUtils';

/**
 * PaymentInfo Model
 */
class PaymentInfoModel extends Decorator {

  constructor () {
    super();
  }

  createPaymentInfo(paymentInfo, riderId) {
    return new Promise((resolve, reject)=>{
      if (!paymentInfo.orderId) {
        let err = new Error("Empty Order id");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }
      if (!paymentInfo.transactionId) {
        let err = new Error("Empty Transaction id");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }
      if (!paymentInfo.totalAmount) {
        let err = new Error("Empty Total Amount");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }
      if (!paymentInfo.email || !ValidateUtils.validateEmail(paymentInfo.email)) {
        let err = new Error("Invalid Email");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }
      if (!paymentInfo.contactNumber || !ValidateUtils.validatePhone(paymentInfo.contactNumber)) {
        let err = new Error("Invalid Contact Number");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }
      if (!paymentInfo.deliveryAddress) {
        let err = new Error("Empty Address");
        err.customMessage = err.message;
        err.appendDetails("PaymentInfo Model", "createPaymentInfo");
        return reject(err);
      }

      if(riderId)
        paymentInfo.riderId = riderId;

      PaymentInfoDao.insertPaymentInfo(paymentInfo).then((result) => {
        let paymentInfoId = result['insertId'];
        resolve({
          status: Constants.SUCCESS,
          paymentInfoId: paymentInfoId
        })
      }).catch((err) =>{
        if(err.errno === Constants.MYSQL_PRIMARY_KEY_VIOLATION) {
          resolve({
            status: Constants.NOT_FOUND,
            message: "Invalid Order Id"
          })
        } else {
          reject(err);
        }
      });
    })
  }

}

export default new PaymentInfoModel();
