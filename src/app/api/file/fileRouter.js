import express from 'express';
import Decorator from '../../helpers/decorator';
import * as util from '../../helpers/utility';
import * as constants from '../../helpers/constants';
import FileModel from './fileModel';

/**
 * File Upload Router
 */
class FileUploadRouter extends Decorator {

  /**
   * Constructor
   * @returns {express.Router} - Rider router
   */
  constructor () {
    super();
    this.router = new express.Router();
    let auth = util.sysAuth();
    let validationMiddlewares = [auth];

    // System endpoints
    this.router.post('/sys/upload', ...validationMiddlewares, this.uploadSystemFile);
    this.router.get('/sys/download/:id', ...validationMiddlewares, this.downloadSystemFile);
    this.router.post('/sys/downloads', ...validationMiddlewares, this.downloadSystemFiles);

    // Customer endpoints
    this.router.post('/cus/upload', util.auth(), this.uploadCustomerFile);
    this.router.get('/cus/download/:id', util.auth(), this.downloadCustomerFile);
    this.router.post('/cus/downloads', util.auth(), this.downloadSystemFiles);

    return this.router
  }

  /**
   * Upload a system file into database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  uploadSystemFile(req, res) {
    const files = req.files
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" )

console.log(req)
    FileModel.saveFile(files, constants.RESET_PWD_USER_TYPES.SYS_USER).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Upload a system file into database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  uploadCustomerFile(req, res) {
console.log("_________________________file_______________________________________")
console.log(req)
console.log(req.files)
console.log(res)
    const files = req.files
    FileModel.saveFile(files, constants.RESET_PWD_USER_TYPES.CUSTOMER).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Download a system file from database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  downloadSystemFile(req, res) {
    const id = req.params['id'];
    FileModel.getFile(id).then((file) => {
console.log("_________________________file_______________________________________")
      console.log(file)
      res.json({
        status: 200,
        fileName: file['file_name'],
	fileGivenName: file['given_name'],
        fileType: file['file_type'],
        data: file['file']
      });
    }).catch((err)=> util.handleError(err, res))
  }

  /**
   * Get system files from database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  downloadSystemFiles(req, res) {
    const filesIds = req.body;
    FileModel.getFiles(filesIds).then(
      (result) => res.status(constants.SUCCESS).json(result)
    ).catch((err)=> util.handleError(err, res));
  }

  /**
   * Download a customer file from database
   * @param {express.Request} req - request object
   * @param {express.Response} res - response object
   */
  downloadCustomerFile(req, res) {
    const id = req.params['id'];
    FileModel.getCustomerFile(id).then((file) => {
      res.header('Content-Type', file['assest_type']);
      res.header('Content-Disposition', `attachment;filename=${file['file_name']}`);
      res.end(file['file']);
    }).catch((err)=> util.handleError(err, res))
  }
}

export default new FileUploadRouter();