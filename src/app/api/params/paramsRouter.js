import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import ParamModel from './paramsModel';

/**
 * Params Router
 */
class ParamsRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Params router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.get('/byKey/:key', ...validationMiddlewares, this.getParamValueByKey);

    //Customer API
    this.router.get('/cus/byKey/:key', util.auth(), this.getParamValueByKey);

    return this.router;
  }

  /**
   * Get Param Value For a Param Key
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getParamValueByKey(req, res) {
    const key = req.params['key'];
    ParamModel.getParamValues(key).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new ParamsRouter();
