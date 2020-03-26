import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import UserModel from './userModel';
import {riderPartnerAdminValidationMiddleware} from '../../helpers/validateUtils';

/**
 * User Router
 */
class UserRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - User router
   */
  constructor() {
    super();
    this.router = new express.Router();

    this.router.get('/:userId', util.auth(), this.getUserByUserId);
    this.router.patch('/:userId', util.auth(), this.updateUserByUserId);
    this.router.get('/by_email/:email', util.auth(), this.getUserByEmail);
    this.router.post('/set_push_notification_id', util.auth(), this.setPushNotificationId);
    this.router.post('/cus/update_device_id', util.auth(), this.updateDeviceId);

    this.router.post('/address', util.auth(), this.insertAddress)
    this.router.patch('/update/address', util.auth(), this.updateAddress)
    this.router.delete('/address', util.auth(), this.removeAddress)
    this.router.patch('/cus/validateOTP', this.validateOTP)
    this.router.patch('/cus/sendOTP', this.sendOTP)

    this.router.get('/sys/all', util.sysAuth(), this.getAllUsers);
    this.router.get('/sys/by_email/:email', util.sysAuth(), this.getSystemUserByEmail);
    this.router.get('/sys/:userId', util.sysAuth(), this.getSystemUserByUserId);
    this.router.patch('/sys/:userId', util.sysAuth(), this.updateSystemUserByUserId);
    this.router.delete('/sys/:userId/:status', util.sysAuth(), this.changeUserActiveStatus);
    this.router.get('/sys/get_customer/:userId', util.sysAuth(), this.getUserByUserId);
    this.router.get('/sys/all_customers/:status', util.sysAuth(), this.getAllAppUsers);
    this.router.delete('/sys/change_cus_status/:userId/:status', util.sysAuth(), this.changeCustomerActiveStatus)

    const riderUserManagementMiddleWares = [util.sysAuth(), riderPartnerAdminValidationMiddleware]
    this.router.get('/sys/riders/:partnerId', riderUserManagementMiddleWares, this.getAllRiderUsersForPartner);
    this.router.post('/sys/riders/update_rider_info', riderUserManagementMiddleWares, this.updateRiderSpecificInfo);
    // this.router.patch('/sys/rider/:userId', riderUserManagementMiddleWares, this.updateRiderDetails);

    return this.router;
  }

  /**
   * Get a user by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getUserByUserId(req, res) {
 console.log("_________________get________________________________________________");
    console.log(req.params["userId"]);
    let userId = req.params["userId"];
    UserModel.getCustomerByUserId(userId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get a system user by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getSystemUserByUserId(req, res) {
    let userId = req.params["userId"];
    UserModel.getSystemUserByUserId(userId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update a user by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateUserByUserId(req, res) {
 console.log("________________________update_________________________________________");
    console.log(req.params["userId"]);
 console.log(req.body);

    let userId = req.params["userId"];
    let user = req.body;
    UserModel.updateCustomerUsereByUserId(userId, user).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update a system user by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateSystemUserByUserId(req, res) {
    let userId = req.params["userId"];
    let user = req.body;
    UserModel.updateSystemUsereByUserId(userId, user).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get a user by user email
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getUserByEmail(req, res) {
    let email = req.params['email'];
    UserModel.getCustomerByEmail(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get a system user by email
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getSystemUserByEmail(req, res) {
    let email = req.params['email'];
    UserModel.getSystemUserByEmail(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Save user's device push notification id in the database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  setPushNotificationId(req, res) {
    let email = req.body["email"];
    let pushNotificationId = req.body["pushNotificationId"];

    UserModel.setPushNotificationId(email, pushNotificationId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Save user's address
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  insertAddress(req, res) {
    let addressObj = req.body;
    UserModel.insertAddress(addressObj).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * update user's address
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateAddress(req, res) {
    let addressObj = req.body;
    UserModel.updateAddress(addressObj).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * remove user's address
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  removeAddress(req, res) {
    let addressId = req.query['addressId']
    UserModel.removeAddress(addressId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get all system users
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllUsers(req, res) {
    const active = req.query['active'];
    const orgId = req.query['orgId'];
    const reqUser = req.user;
    UserModel.getAllUsers(reqUser, active, orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * change active status of system users by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  changeUserActiveStatus(req, res) {
    const reqUser = req.user;
    const userId = req.params["userId"];
    const activeStatus = req.params['status'];
    UserModel.changeUserActiveStatus(reqUser, userId, activeStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * change active status of customer by user id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  changeCustomerActiveStatus(req, res) {
    const reqUser = req.user;
    const userId = req.params["userId"];
    const activeStatus = req.params['status'];
    UserModel.changeCustomerActiveStatus(reqUser, userId, activeStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * save device id for user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateDeviceId(req, res) {
    const user = req.user;
    const deviceId = req.body.deviceId;
    const deviceOs = req.body.deviceOs;
    UserModel.updateDeviceId(user, deviceId, deviceOs).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * save device id for user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllAppUsers(req, res) {
    const activeStatus = req.params['status'];
    UserModel.getAllAppUsers(activeStatus).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get all rider users for partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllRiderUsersForPartner(req, res) {
    const orgId = req.params['partnerId'];
    UserModel.getAllRiderUsersForPartner(orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Update a rider specif information
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateRiderSpecificInfo(req, res) {
    const {userId, license, vehicalNo, nic} = req.body
    const reqUserOrg = req.user['org_id']
    UserModel.updateRiderSpecificInfo(userId, license, vehicalNo, nic, reqUserOrg).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Validate Customer OTP
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  validateOTP(req, res) {
    UserModel.validateOTP(req.body).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Send Customer OTP
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  sendOTP(req, res) {
    UserModel.sendOTP(req.body.email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }
}

export default new UserRouter();
