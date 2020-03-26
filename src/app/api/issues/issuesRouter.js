import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import IssueCategoriesModel from './issueCategoriesModel';
import IssueModel from './issueModel';

/**
 * IssueCategories Router
 */
class IssueCategoriesRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - IssueCategories router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    //Sys API
    this.router.get('/getAllIssueCategories', ...validationMiddlewares, this.getAllIssueCategories);
    this.router.post('', ...validationMiddlewares, this.addIssue);


    //Customer API
    this.router.get('/cus/getAllIssueCategories', util.auth(), this.getAllIssueCategories);

    return this.router;
  }

  /**
   * Get all Issue Categories
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllIssueCategories(req, res) {
    IssueCategoriesModel.getIssueCategories().then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Add Issue
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  addIssue(req, res) {
    let issue = req.body;
    IssueModel.addIssue(issue, req.user.user_id).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new IssueCategoriesRouter();
