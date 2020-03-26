import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import OrderOrganizationStockModel from './orderOrganizationStockModel';

/**
 * ReportRouter Router
 */
class ReportRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - ReportRouter router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.get('/settlements', ...validationMiddlewares, this.getOrderTotal);
    this.router.get('/settlements/store', ...validationMiddlewares, this.getStoreOrderTotal);
    this.router.get('/items', ...validationMiddlewares, this.getItemCount);
    this.router.get('/items/store', ...validationMiddlewares, this.getStoreItemCount);
    this.router.get('/orders', ...validationMiddlewares, this.getOrderStatus);
    this.router.get('/orders/store', ...validationMiddlewares, this.getStoreOrderStatus);

    return this.router;
  }

  /**
   * Get Settlements
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOrderTotal(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const orgId = req.query.orgId;
    OrderOrganizationStockModel.getOrderTotal(status, fromDate, toDate, orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get Settlements For Stores
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getStoreOrderTotal(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const branchId = req.query.branchId;
    OrderOrganizationStockModel.getStoreOrderTotal(status, fromDate, toDate, branchId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

   /**
   * Get Total Items sold by partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getItemCount(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const orgId = req.query.orgId;
    OrderOrganizationStockModel.getItemCount(status, fromDate, toDate, orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get Total Items sold by partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getStoreItemCount(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const branchId = req.query.branchId;
    OrderOrganizationStockModel.getStoreItemCount(status, fromDate, toDate, branchId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get Orders By Status
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getOrderStatus(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const orgId = req.query.orgId;
    OrderOrganizationStockModel.getOrderStatus(status, fromDate, toDate, orgId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get Orders By Status And Store
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getStoreOrderStatus(req, res) {
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const branchId = req.query.branchId;
    OrderOrganizationStockModel.getStoreOrderStatus(status, fromDate, toDate, branchId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new ReportRouter();
