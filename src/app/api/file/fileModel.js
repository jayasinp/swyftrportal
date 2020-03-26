import Decorator from '../../helpers/decorator';
import * as constants from '../../helpers/constants';
import SystemAssestDao from '../../databases/mysql/systemAssest/systemAssestDao';
import ProfileAssestDao from '../../databases/mysql/profileAssest/profileAssestDao';
import FileUtils from '../../../utils/fileUtils';

let _this;
/**
 * File Model
 */
class FileModel extends Decorator {

  constructor () {
    super();
    _this = this;
  }

  saveFile(files, usertype) {
    return new Promise((resolve, reject) => {
      if (!files || !files.fileToUpload) {
        let err = new Error("File is missing");
        err.customMessage = err.message;
        err.appendDetails("FileModel", "saveFile");
        return reject(err);
      }

      if (usertype === constants.RESET_PWD_USER_TYPES.SYS_USER) {
        return _this._saveSystemFileToDB(files.fileToUpload, '', '').then((result) => resolve({
          status: 200,
          fileId: result['insertId']
        })).catch(reject);
      } else {
        return _this._saveCustomerFileToDb(files.fileToUpload).then((result) => resolve({
          status: 200,
          fileId: result['insertId']
        })).catch(reject);
      }
    });
  }

  _saveSystemFileToDB(file, givenName, description) {
    return SystemAssestDao.saveFileToDB(file.name, givenName, null, file.mimetype, description, file.data);
  }

  _saveCustomerFileToDb (file) {
    return ProfileAssestDao.saveFileToDB(file.name, file.mimetype, file.data);
  }


saveFilenew(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
 console.log("--------------------------------yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy-------------------------------------")

        let err = new Error("File is missing");
        err.customMessage = err.message;
        err.appendDetails("FileModel", "saveFile");
        return reject(err);
      }

 console.log("--------------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-------------------------------------")

        return _this._saveSystemFileToDBnew(file).then((result) => resolve({
          status: 200,
          fileId: result['insertId']
        })).catch(reject);
     
    });
   }

  _saveSystemFileToDBnew(file) {
console.log("--------------------------------mmmmmmmmmmmmmmmmmxxxxxx-------------------------------------")

    return SystemAssestDao.saveFileToDB(file.originalname, file.filename, file.size, file.mimetype, file.path, null);
  }

  getFile(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        let err = new Error("File Id is missing");
        err.customMessage = err.message;
        err.appendDetails("FileModel", "getFile");
        return reject(err);
      }

      SystemAssestDao.getFileById(id).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("File with given id does not exists");
          err.customMessage = err.message;
          err.appendDetails("FileModel", "getFile");
          return reject(err);
        }

        const file = rows[0];
        return resolve(file);
      }).catch(reject);
    });
  }

  getFiles(ids) {
    return new Promise((resolve, reject) => {
      if (!ids) {
        let err = new Error("File Ids are missing");
        err.customMessage = err.message;
        err.appendDetails("FileModel", "getFiles");
        return reject(err);
      }

      SystemAssestDao.getFileByIds(ids).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Filesw with given id does not exists");
          err.customMessage = err.message;
          err.appendDetails("FileModel", "getFiles");
          return reject(err);
        }

        let list = [];
        for(let fileObject of rows){
          list.push(this._buildFile(fileObject));
        }
        return resolve({
          status: constants.SUCCESS,
          data: list
        });
      }).catch(reject);
    });
  }

  getCustomerFile(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        let err = new Error("File Id is missing");
        err.customMessage = err.message;
        err.appendDetails("FileModel", "getFile");
        return reject(err);
      }

      ProfileAssestDao.getFileById(id).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("File with given id does not exists");
          err.customMessage = err.message;
          err.appendDetails("FileModel", "getFile");
          return reject(err);
        }
        let list = [];
        for(let fileObject of rows){
          list.push(this._buildFile(fileObject));
        }
        return resolve(list);
      }).catch(reject);
    });
  }

  _buildFile(file) {
    return {
      fileName: file['file_name'],
      fileType: file['file_type'],
      data: file['file_name']//FileUtils.convertBlobToBase64(file['file'])
    };
  }
}

export default new FileModel()
