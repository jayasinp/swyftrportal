import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import CategoryModel from './categoryModel';

/**
 * Category Router
 */
class CategoryRouter extends Decorator {

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
    this.router.get('/allSubCategories/:categoryId', ...validationMiddlewares, this.getAllSubcategories);
    this.router.get('/allStores/:categoryId', ...validationMiddlewares, this.getAllStoresByCategory);

    //Customer API
    this.router.get('/cus/allSubCategories/:categoryId',  this.getAllSubcategories);//util.auth(), 
    this.router.get('/cus/allStores/:categoryId',  this.getAllStoresByCategory);//util.auth(), 

    return this.router;
  }

  /**
   * Get all Sub Categories For a Category
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllSubcategories(req, res) {
    const categoryId = req.params['categoryId'];
    CategoryModel.getSubCategories(categoryId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

  /**
   * Get all Stores For a Category
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getAllStoresByCategory(req, res) {
    const categoryId = req.params['categoryId'];
    CategoryModel.getStoresByCategory(categoryId).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=>util.handleError(err, res));
  }

}

export default new CategoryRouter();
