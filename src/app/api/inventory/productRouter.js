import Decorator from "../../helpers/decorator";
import express from 'express';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import ProductModel from './productModel';





const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, `FunOfHeuristic_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
 







/**
 * Product Router
 */
class ProductRouter extends Decorator{

  constructor() {
    super();
    this.router = new express.Router();

    let sysAuth = util.sysAuth();
    let validationMiddlewares = [sysAuth];

    //Customer
    this.router.post('cus/byProductIds', util.auth(), this.getProductsByIds);
    this.router.get('/cus/byName/:name', this.getProductsByName);// util.auth(),

    // System  
    this.router.post('/', validationMiddlewares, this.createProduct);
  this.router.post('/upPro', validationMiddlewares, this.createUserProduct);


 this.router.post('/image', validationMiddlewares, this.uploadImage);


    this.router.post('/availab', validationMiddlewares, this.updateAvalibProduct);
    this.router.post('/byProductIds', validationMiddlewares, this.getProductsByIds);
    this.router.delete('/:productId', validationMiddlewares, this.deleteProduct);
    this.router.get('/:organizationId/:branchId', validationMiddlewares, this.getProductsByOrganizationAndBranch);
    this.router.get('/sys/byName/:name', validationMiddlewares, this.getProductsByName);

    return this.router;
  }




  /**
   * Create a Product
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  uploadImage(req, res , next) {
//console.log("uploadImage  app.post('/image', upload.single('file'), (req, res, next) =>")
    app.post('/image', upload.single('file'), (req, res, next) => {
      const file = req.file;
    //  console.log(file.filename);
      if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
      }
        res.send(file);
    })
  }




  /**
   * Create a Product
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createProduct(req, res) {
    let product = req.body;
console.log("createProduct(req, res) {$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
console.log(product)
    ProductModel.createProduct(product).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

 /**
   * Create a Product
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  createUserProduct(req, res) {
    let product = req.body;
//console.log("createProduct(req, res) {$$$$$$$$$$333333333333333333333333333333333333333333333333333333$$$$$$$$")
//console.log(product)
    ProductModel.createUserProduct(product).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }


/**
   * Update Product Avalability a Product
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  updateAvalibProduct(req, res) {
    let product = req.body;
    ProductModel.updateAvalibProduct(product).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Delete a Product
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  deleteProduct(req, res) {
    const productId = req.params['productId'];
    ProductModel.deleteProduct(productId).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get Products By Organization And Branch
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getProductsByOrganizationAndBranch(req, res) {
    const organizationId = req.params['organizationId'];
    const branchId = req.params['branchId'];
    ProductModel.getProducts(organizationId, branchId, req.user).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get Products By Organization And Branch
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getProductsByName(req, res) {
    const name = req.params['name'];
    ProductModel.getProductsByName(name).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }

  /**
   * Get Products By Product Ids
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  getProductsByIds(req, res) {
    ProductModel.getProductsByIds(req.body).then(
        (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err) => util.handleError(err, res));
  }
}

export default new ProductRouter();