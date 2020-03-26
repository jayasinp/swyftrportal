import Decorator from "../../helpers/decorator";
import express from 'express';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import OrderModel from './orderModel';

/**
 * Order Router
 */
class OrderRouter extends Decorator{

  constructor() {
    super();
    this.router = new express.Router();

    let sysAuth = util.sysAuth();
    let validationMiddlewares = [sysAuth]

    // Customer apps
    this.router.post('/', util.auth(), this.createOrder);
    this.router.get('/customer/:customerId', util.auth(), this.getOrderByCustomer);
    this.router.get('/:id', util.auth(), this.getOrderById);
    this.router.delete('/:id', util.auth(), this.calcelOrder);
    this.router.post('/change_status_qr', util.auth(), this.changeOrderStatusByQRByCustomer);
    this.router.get('/:id/rider', util.auth(), this.getOrderRiderInfo);

    // System
    this.router.get('/sys/all',  ...validationMiddlewares, this.getAllOrdersByUserOrg);// add  util.auth(),
    this.router.get('/sys/info/:id', ...validationMiddlewares, this.getOrderInfo);
    this.router.post('/sys/change_status/:id', ...validationMiddlewares, this.changeOrderStatus);
    this.router.post('/sys/change_status_qr', ...validationMiddlewares, this.changeOrderStatusByQRByRider);
    this.router.get('/sys/:id', ...validationMiddlewares, this.getOrderById);

    return this.router;
  }

  /**
   * Create an Order
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createOrder(req, res) {
 console.log("_____________________ createOrder(req, res)____________")
    console.log(req.body)
    let order = req.body;
    OrderModel.createOrder(order).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }





  getOrderByCustomer(req, res) {
    let customerId = req.params["customerId"];
    let reqUser = req.user;
    OrderModel.getOrderByCustomer(customerId, reqUser).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  getOrderById(req, res) {
    let id = req.params["id"];
    let customerId = req.user['user_id']
    OrderModel.getOrderById(id, customerId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  calcelOrder(req, res) {
    let id = req.params["id"];
    OrderModel.cancelOrder(id).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  getAllOrdersByUserOrg (req, res) {
    const userEmail = req.headers['x-username'];
    const status = req.query["status"];
    OrderModel.getAllOrdersByUserOrg(userEmail, status).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  getOrderInfo(req, res) {
    const orderId = req.params['id'];
    OrderModel.getOrderInfo(orderId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  changeOrderStatus(req, res) {
    const orderId = req.params['id'];
    const newStatus = req.body.status;
    OrderModel.changeOrderStatus(orderId, newStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  changeOrderStatusByQRByRider(req, res) {
    const qrString = req.body.qrString;
    const newStatus = req.body.status;
 console.log("changeOrderStatusByQRByRider");
    console.log(qrString);
    console.log(newStatus);
    OrderModel.changeOrderStatusByQRByRider(qrString, newStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  changeOrderStatusByQRByCustomer(req, res) {
    const qrString = req.body.qrString;
    const newStatus = req.body.status;
    OrderModel.changeOrderStatusByQRByCustomer(qrString, newStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  getOrderRiderInfo(req, res) {
    const orderId = req.params['id'];
    OrderModel.getOrderRiderInfo(orderId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }
}

export default new OrderRouter();