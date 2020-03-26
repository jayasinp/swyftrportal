import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import PaymentInfoModel from './paymentInfoModel';

/**
 * PaymentInfo Router
 */
class PaymentInfoRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Category router
   */
  constructor () {
    super();
    this.router = new express.Router();

    let sysAuth = util.sysAuth();
    let validationMiddlewares = [sysAuth]

    //Customer API
    this.router.post('/cus', util.auth(), this.createPaymentInfo);

    //Sys API
    this.router.post('/sys', ...validationMiddlewares, this.createPaymentInfoSys);

    return this.router;
  }

  /**
   * Insert PaymentInfo
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createPaymentInfo(req, res) {
    const paymentInfo = req.body;
    PaymentInfoModel.createPaymentInfo(paymentInfo).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Insert PaymentInfo
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createPaymentInfoSys(req, res) {
    const paymentInfo = req.body;
    let riderId = req.user['user_id']
    PaymentInfoModel.createPaymentInfo(paymentInfo, riderId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new PaymentInfoRouter();
