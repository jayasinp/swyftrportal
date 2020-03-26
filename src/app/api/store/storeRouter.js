import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import StoreModel from './storeModel';

/**
 * Store Router
 */
class StoreRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Rider router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    this.router.post('/', ...validationMiddlewares, this.createStore);
    this.router.patch('/', ...validationMiddlewares, this.updateStore);
    this.router.patch('/onlineStatus', ...validationMiddlewares, this.updateStoreOnlineStatus);
    this.router.post('/onlineStatusById', ...validationMiddlewares, this.updateStoreOnlineStatusById);
    this.router.get('/', ...validationMiddlewares, this.getStoreById);
    this.router.get('/all/:partnerId', ...validationMiddlewares, this.getAllStoresForPartner);
    this.router.get('/allStore/:userId', ...validationMiddlewares, this.getAllStoresForUser);
    this.router.get('/allProducts/:storeId', ...validationMiddlewares, this.getAllProductsByStore);
    this.router.get('/allUserProducts/:storeIds', ...validationMiddlewares, this.getAllUserProductsByStore);
    this.router.get('/branches_by_user_org',...validationMiddlewares, this.getBranchesForUserOrg);

    //Customer API
    this.router.get('/cus', util.auth(), this.getStoreById);
    this.router.get('/cus/all/:partnerId', this.getAllStoresForPartner);// util.auth(),
    this.router.get('/cus/allProducts/:storeId',  this.getAllProductsByStore);//util.auth(),
    this.router.get('/cus/allStores',  this.getAllStores);//util.auth(), 

    return this.router;
  }

  /**
   * Create a store
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createStore(req, res) {
    const store = req.body;
    StoreModel.createStore(store).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update store details
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateStore(req, res) {
    const store = req.body;
    StoreModel.updateStore(store).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update store online status
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateStoreOnlineStatus(req, res) {
    const store = req.body;
    StoreModel.updateStoreOnlineStatus(store).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update store online status
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateStoreOnlineStatusById(req, res) {
    const store = req.body;
    StoreModel.updateStoreOnlineStatusById(store).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get store by store id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getStoreById(req, res) {
    const storeId = req.query['storeId'];
    StoreModel.getStoreById(storeId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all stores for a partner
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllStoresForPartner(req, res) {
    const partnerId = req.params['partnerId']
    StoreModel.getAllStoresForPartner(partnerId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

 /**
   * Get all stores for a User/managerId
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllStoresForUser(req, res) {
    const userId = req.params['userId']
    StoreModel.getAllStoresForUser(userId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all products for a store
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllProductsByStore(req, res) {
    const storeId = req.params['storeId']
    StoreModel.getProductsByStore(storeId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

/**
   * Get all products for a store for User Id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllUserProductsByStore(req, res) {
    const storeIds = req.params['storeIds']
    StoreModel.getUserProductsByStore(storeIds).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get All Stores
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllStores(req, res) {
    const npp = req.query.npp;
    const page = req.query.page;
    StoreModel.getAllStores(npp, page).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get All Stores for logined user
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getBranchesForUserOrg(req, res) {
    const user = req.user;
    StoreModel.getBranchesForUserOrg(user).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

}

export default new StoreRouter();
