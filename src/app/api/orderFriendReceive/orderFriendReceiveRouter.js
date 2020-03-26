import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import OrderFriendReceiveModel from './orderFriendReceiveModel';

/**
 * OrderFriendReceive Router
 */
class OrderFriendReceiveRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - OrderFriendReceive router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.get('/byOrderId/:orderId', ...validationMiddlewares, this.getOrderFriendDetailsByOrderId);

    //Customer API
    this.router.get('/cus/byOrderId/:orderId', util.auth(), this.getOrderFriendDetailsByOrderId);

    return this.router;
  }

  /**
   * Get all Sub Categories For a Category
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOrderFriendDetailsByOrderId(req, res) {
    const orderId = req.params['orderId'];
    OrderFriendReceiveModel.getOrderFriendDetailsByOrderId(orderId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new OrderFriendReceiveRouter();
