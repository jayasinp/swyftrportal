import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import UserRatingModel from './userRatingModel';

/**
 * UserRating Router
 */
class UserRatingRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Category router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.get('/sys/byOrder/:orderId', ...validationMiddlewares, this.getUserRatingsByOrder);
    this.router.post('/sys', ...validationMiddlewares, this.createUserRating);

    //Customer API
    this.router.get('/cus/byOrder/:orderId', util.auth(), this.getUserRatingsByOrder);
    this.router.post('/cus', util.auth(), this.createUserRating);

    return this.router;
  }

  /**
   * Insert User Ratings
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createUserRating(req, res) {
    const rating = req.body;
    UserRatingModel.createUserRating(rating).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get User Rating By Order
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getUserRatingsByOrder(req, res) {
    const orderId = req.params['orderId'];
    UserRatingModel.getRatingByOrder(orderId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new UserRatingRouter();
