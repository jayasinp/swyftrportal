import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import FriendReceiveCollectorModel from './friendReceiveCollectorModel';

/**
 * OrderFriendReceiveCollector Router
 */
class OrderFriendReceiveCollectorRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - OrderFriendReceiveCollector router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.post('/insert', ...validationMiddlewares, this.saveCollectorDetails);

    return this.router;
  }

  /**
   * Get all Sub Categories For a Category
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  saveCollectorDetails(req, res) {
    FriendReceiveCollectorModel.create(req.body).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new OrderFriendReceiveCollectorRouter();
