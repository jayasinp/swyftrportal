import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import PartnerModel from './partnerModel';

/**
 * Partner Router
 */
class PartnerRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Partner router
   */
  constructor() {
    super();
    this.router = new express.Router();

    this.router.post('/', util.sysAuth(), this.createPartner);
    this.router.patch('/', util.sysAuth(), this.updatePartner);

    this.router.get('/', util.auth(), this.getStorePartnerById);
    this.router.get('/sys', util.sysAuth(), this.getPartnerById)

    this.router.get('/search_by/:keyWord',  this.searchStorePartnerByName);//util.auth(),
    this.router.get('/sys/search_by/:keyWord/:status', util.sysAuth(), this.searchPartnerByName);

    this.router.get('/all', util.auth(), this.getAllStorePartners);
    this.router.get('/sys/all/:status', util.sysAuth(), this.getAllPartners)

    this.router.delete('/sys/:partnerId/:status', util.sysAuth(), this.changePartnerStatus)

    return this.router;
  }

  /**
   * Create a partner organization
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createPartner(req, res) {
    let partner = req.body;
    PartnerModel.createPartner(partner).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Update a partner organization
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updatePartner(req, res) {
    let orgId = req.query.orgId;
    let partner = req.body;
    PartnerModel.updatePartner(orgId, partner).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get a partner organization by id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getPartnerById(req, res) {
    let partnerId = req.query.orgId;
    PartnerModel.getPartnerById(partnerId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get a store partner organization by id
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getStorePartnerById(req, res) {
    let partnerId = req.query.orgId;
    PartnerModel.getStorePartnerById(partnerId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Search store partner organization by name
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  searchStorePartnerByName(req, res) {
 console.log("__________________________________________________________________________________&&&&&&&&&&&&&&&&&&&_______________________________________________")
    let keyWord = req.params["keyWord"];
    PartnerModel.searchStorePartnerByName(keyWord, true).then(
       (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Search a partner organization by name
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  searchPartnerByName(req, res) {
    let keyWord = req.params["keyWord"];
    PartnerModel.searchPartnerByName(keyWord).then(

      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all partner organizations
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllStorePartners(req, res) {
    let keyWord = ''
    PartnerModel.searchStorePartnerByName(keyWord, true).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Get all partner organizations
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllPartners(req, res) {
    let keyWord = '';
    let status = req.params['status']
    PartnerModel.searchPartnerByName(keyWord, status).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Activate or deactivate partner organizations
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  changePartnerStatus(req, res) {
    const partnerId = req.params['partnerId'];
    const status = req.params['status']
    const reqUser = req.user;
    PartnerModel.changePartnerStatus(reqUser, partnerId, status).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

}

export default new PartnerRouter();
