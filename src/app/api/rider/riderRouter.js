import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import RiderModel from './riderModel';
import {riderPartnerAdminValidationMiddleware, riderValidationMiddleware} from '../../helpers/validateUtils';

/**
 * Rider Router
 */
class RiderRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Rider router
   */
  constructor () {
    super();
    this.router = new express.Router();
    const auth = util.sysAuth();
    const validationMiddlewares = [auth, riderValidationMiddleware];
    const riderAdminValidationMiddleWare = [auth, riderPartnerAdminValidationMiddleware]

    this.router.patch('/', ...validationMiddlewares, this.updateRider);
    this.router.post('/update_password', ...validationMiddlewares, this.resetPassword);

    this.router.get('/order_history', ...validationMiddlewares, this.getOrderHistory)
    this.router.get('/new_orders', ...validationMiddlewares, this.getNewOrderList)
    this.router.get('/on_goiong_orders', ...validationMiddlewares, this.getOngoingOrderList)
    this.router.patch('/change_status', ...validationMiddlewares, this.changeRiderStatus)
    this.router.patch('/accept_order', ...validationMiddlewares, this.acceptOrderConsent)

    this.router.get('/last_known_location/:riderId', ...riderAdminValidationMiddleWare, this.getLastKnownLocationForRider)
    this.router.get('/all/last_known_location', ...riderAdminValidationMiddleWare, this.getLocationOfRidersInOrg)
    this.router.get('/all/ongoing_orders', ...riderAdminValidationMiddleWare, this.getAllOrdersAssignedToRiderPartner)
    this.router.post('/assign_rider', ...riderAdminValidationMiddleWare, this.assignRider)
    this.router.get('/unassigned_orders', ...riderAdminValidationMiddleWare, this.getAllUnassignedOrders)
    this.router.get('/near_by_riders/:orderId', ...riderAdminValidationMiddleWare, this.getNearByRidersForOrder);
    this.router.get('/order_of_rider/:id', ...riderAdminValidationMiddleWare, this.allOrdersForRider)

    return this.router;
  }

  /**
   * Update rider details
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateRider(req, res) {
    const email = req.headers['x-username'];
    const rider = req.body;
    RiderModel.updateRiderByRider(email, rider).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Reset rider password
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  resetPassword(req, res) {
    const email = req.headers['x-username'];
    const {newPassword, retypePassword, oldPassword} = req.body;
    RiderModel.updatePassword(email, newPassword, retypePassword, oldPassword).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get rider order history
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOrderHistory(req, res) {
    const email = req.headers['x-username'];
    RiderModel.getRidersOrderHistory(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get new order list assigned to rider
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getNewOrderList(req, res) {
    const email = req.headers['x-username'];
    RiderModel.getNewOrdersForRider(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get ongoing order list assigned to rider
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOngoingOrderList(req, res) {
    const email = req.headers['x-username'];
    RiderModel.getOnGoingOrdersForRider(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Change rider status ONLINE/OFFLINE
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  changeRiderStatus(req, res) {
    const body = req.body;
    body.riderId = req.user['user_id']
console.log("changeRiderStatus")
console.log(body)
    RiderModel.changeRiderStatus(body).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Rider sent consent to say they have seen
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  acceptOrderConsent(req, res) {
    const body = req.body;
    body.riderId = req.user['user_id']
    RiderModel.acceptOrderConsent(body).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Last known location of a rider
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getLastKnownLocationForRider(req, res) {
    const riderId = req.params['riderId']
    const reqUser = req.user
    RiderModel.getLastKnownLocationForRider(riderId, reqUser).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Last known location of all riders of rider partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getLocationOfRidersInOrg(req, res) {
    const orgId = req.user['org_id']
    RiderModel.getLocationOfRidersInOrg(orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * All orders assigned to a rider partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllOrdersAssignedToRiderPartner(req, res) {
    const orgId = req.user['org_id']
    RiderModel.getAllOrdersAssignedToRiderPartner(orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Assign riders to orders
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  assignRider(req, res) {
    const body = req.body
    const reqUser = req.user
    RiderModel.assignRider(reqUser, body).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch(err => util.handleError(err, res));
  }

  /**
   * Get unassigned orders
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllUnassignedOrders(req, res) {
    RiderModel.getAllUnassignedOrders().then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch(err => util.handleError(err, res));
  }

  /**
   * Get near by riders for a order pickup location
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getNearByRidersForOrder(req, res) {
    const orderId = req.params['orderId']
    const reqUser = req.user
    RiderModel.getNearByRidersForOrder(orderId, reqUser).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch(err => util.handleError(err, res));
  }

  /**
   * Get All Orders For Rider
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  allOrdersForRider(req, res) {
    const riderId = req.params['id']
    const reqUser = req.user
    RiderModel.allOrdersForRider(riderId, reqUser).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch(err => util.handleError(err, res));
  }
}

export default new RiderRouter();
