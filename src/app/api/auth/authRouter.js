import express from 'express';
import Decorator from '../../helpers/decorator';
import * as constants from '../../helpers/constants';
import authModel from './authModel';
import * as util from '../../helpers/utility';

/**
 * Auth Router
 */
class AuthRouter extends Decorator {

  /**
   * constructor
   */
  constructor() {
    super();
    this.router = express.Router();
    let sysAuth = util.sysAuth();
    let validationMiddlewares = [sysAuth, this._userValidationMiddleware]

    // Customer
    this.router.post('/cus/register', this.cusRegister);
    this.router.post('/cus/login', this.cusLogin);
    this.router.post('/cus/send_reset_password', this.sendResetPasswordLink);
    this.router.post('/cus/reset_password', this.resetCustomerPasswordWithToken)


    // System User
    this.router.post('/sys/login', this.portalSignin);
    this.router.post('/sys/send_reset_password_link', this.sendSysUserResetPasswordLink);
    this.router.post('/sys/reset_password', this.resetSysUserPassword);
    this.router.post('/sys/register', sysAuth, this.sysRegister);
    this.router.post('/sys/update_password', ...validationMiddlewares, this.updateSysUserPassword);
    this.router.post('/sys/permission', ...validationMiddlewares, this.grantPermissionsForUser);
    this.router.get('/sys/permission', ...validationMiddlewares, this.getPermissionsOfUser);
    this.router.get('/sys/permission/names', ...validationMiddlewares, this.getAllowedPermissionNamesForUser);
    this.router.get('/sys/permission/all', ...validationMiddlewares, this.getAllPermissions);
    this.router.get('/sys/permission/other/:userId', ...validationMiddlewares, this.getOtherUserPermissions);

    // Rider
    this.router.post('/rider/login', this.riderSignin)

    return this.router;
  }

  _userValidationMiddleware(req, res, next) {
    const email = req.headers['x-username'];
    authModel.__validateForUser(email).then(next).catch(
      (err) => util.handleError(err, res, constants.FORBIDDEN)
    )
  }

  /**
   * Sign up a customer
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  cusRegister(req, res) {
    let body = req.body;
    authModel.registerCustomer(body).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Sign up a system user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  sysRegister(req, res) {
    let body = req.body;
    authModel.registerSystemUser(body).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Login a customer
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  cusLogin(req, res) {
    let body = req.body;
    authModel.loginCustomer(body).then((result)=>{
      if(result && result.status) {
        if(result.status === constants.UNAUTHORIZED) return util.handleError(new Error("Unauthorized"), res, constants.UNAUTHORIZED);
        if(result.status === constants.NOT_ACCEPTABLE) {
          let err = new Error(result.message);
          err.customMessage = result.message;
          return util.handleError(err, res, constants.NOT_ACCEPTABLE);
        }        
        if(result.status === constants.SUCCESS) return res.status(constants.SUCCESS).json(result);
        let err = new Error("Unknown Error");
        if(result.message)
          err.customMessage = result.message;
        else
          err.customMessage = 'Unknown Error';
        err.appendDetails("AuthRouter", "cusLogin");
        return util.handleError(err, res, constants.BAD_REQUEST);
      }
      let err = new Error('Bad Request')
      err.customMessage = 'Bad Request';
      err.appendDetails("AuthRouter", "cusLogin");
      return util.handleError(err, res, constants.BAD_REQUEST);
      
    }).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Login a portal user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  portalSignin(req, res) {
    let body = req.body;
    authModel.loginSystemUser(body).then((result)=>{
      if(result && result.status) {
        if(result.status === constants.UNAUTHORIZED) return util.handleError(new Error("Unauthorized"), res, constants.UNAUTHORIZED);
        if(result.status === constants.SUCCESS) return res.status(constants.SUCCESS).json(result);
        let err = new Error("Unknown Error");
        err.customMessage = 'Unknown Error';
        err.appendDetails("AuthRouter", "portalSignin");
        return util.handleError(err, res, constants.BAD_REQUEST);
      }
      let err = new Error('Bad Request')
      err.customMessage = 'Bad Request';
      err.appendDetails("AuthRouter", "portalSignin");
      return util.handleError(err, res, constants.BAD_REQUEST);
      
    }).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Login a rider
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  riderSignin(req, res) {
    let body = req.body;
    authModel.loginRiderUser(body).then((result)=>{
      if(result && result.status) {
        if(result.status === constants.UNAUTHORIZED) return util.handleError(new Error("Unauthorized"), res, constants.UNAUTHORIZED);
        if(result.status === constants.SUCCESS) return res.status(constants.SUCCESS).json(result);
        let err = new Error("Unknown Error");
        err.customMessage = 'Unknown Error';
        err.appendDetails("AuthRouter", "riderSignin");
        return util.handleError(err, res, constants.BAD_REQUEST);
      }
      let err = new Error('Bad Request')
      err.customMessage = 'Bad Request';
      err.appendDetails("AuthRouter", "riderSignin");
      return util.handleError(err, res, constants.BAD_REQUEST);

    }).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Send reset password link for customer
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  sendResetPasswordLink(req, res) {
    let email = req.body["email"];
 console.log(email);
    authModel.sendResetPasswordLink(email).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Reset customer password with token emailed to customer email address
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  resetCustomerPasswordWithToken(req, res) {
    let body = req.body
    authModel.resetCustomerPasswordWithToken(body).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Send reset password link for system user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  sendSysUserResetPasswordLink(req, res) {
    let email = req.body["email"];
console.log(email);
    authModel.sendSysUserResetPasswordLink(email).then(
      (result)=> res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res, constants.BAD_REQUEST));
  }

  /**
   * Update sys user password
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateSysUserPassword(req, res) {
    const email = req.headers['x-username'];
    const {newPassword, retypePassword, oldPassword} = req.body;
    authModel.updateSysUserPassword(email, newPassword, retypePassword, oldPassword).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Add or Remove permissions to a user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  grantPermissionsForUser(req, res) {
    const newUserId = req.body.userId
    const permissionArr = req.body.permissions
    const superUserEmail = req.headers['x-username'];

    authModel.addOrRemovePermissionsToNewUser(superUserEmail, newUserId, permissionArr).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all system permissions
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllPermissions(req, res) {
    const email = req.headers['x-username'];
    authModel.getAllSystemPermissions(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all permissions of a user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getPermissionsOfUser(req, res) {
    const email = req.headers['x-username'];
    authModel.getPermissionsOfUser(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all permission names of a user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllowedPermissionNamesForUser(req, res) {
    const email = req.headers['x-username'];
    authModel.getAllowedPermissionsNamesForUser(email).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all permissions of another user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOtherUserPermissions(req, res) {
    const superUserEmail = req.headers['x-username'];
    const otherUserId = req.params['userId'];
    authModel.getPermissionsOfUserByUserId(superUserEmail, otherUserId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update sys user password by rest password token
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  resetSysUserPassword(req, res) {
console.log(req.body);
    const {token, password, retypePassword} = req.body;
    authModel.updateSysUserPasswordByToken(token, password, retypePassword).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res, err.errorStatusCode || constants.BAD_REQUEST));
  }
}

export default new AuthRouter();
