/* eslint-disable complexity */
import Decorator from '../../helpers/decorator';

import StoreDao from '../../databases/mysql/store/storeDao';
import OrganizationDao from '../../databases/mysql/organization/organizationDao';
import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao';
import ProductModel from '../inventory/productModel'
import * as Constants from '../../helpers/constants';

let _this;
/**
 * Store Model
 */
class StoreModel extends Decorator {

  constructor () {
    super();
    _this = this;
  }

  createStore(store) {
    return new Promise((resolve, reject)=>{
      if (!store) {
        let err = new Error("Empty store details");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      if (!store.orgId) {
        let err = new Error("Empty store partner id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      if (!store.branchName) {
        let err = new Error("Empty store name.");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      if (!store.managerId) {
        let err = new Error("Empty store manager id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      if (!store.address || !store.district || !store.province || !store.phone) {
        let err = new Error("One or more store contact details missing");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      if (!store.longitude || !store.latitude) {
        let err = new Error("Store location coordinates missing");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "createStore");
        return reject(err);
      }

      StoreDao.getPartnerBranchByName(store.branchName, store.orgId).then((rows)=> {
        if (rows && rows.length) {
          let err = new Error(`Branch with name '${store.branchName}' already exist for this partner organization`);
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "createStore");
          return reject(err);
        }

        OrganizationDao.getOrganizationByOrgId(store.orgId).then((organizationResult)=>{
          if (!organizationResult || !organizationResult.length) {
            let err = new Error("This store belongs to an invalid partner organization");
            err.customMessage = err.message;
            err.appendDetails("StoreModel", "createStore");
            return reject(err);
          }
          store.logo = organizationResult[0].logo_id;
          SysUserProfileDao.getUserByEmailOrUserId(store.managerId).then((rows)=> {
            if (!rows || !rows.length || rows[0]['org_id'] !== store.orgId) {
              let err = new Error("Invalid store manager or manager does not belong to this organization");
              err.customMessage = err.message;
              err.appendDetails("StoreModel", "createStore");
              return reject(err);
            }

            StoreDao.createStore(store).then((res)=> resolve({
              status: 200,
              storeId: res["insertId"]
            })).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  updateStore(store) {
    return new Promise((resolve, reject)=>{
      if (!store) {
        let err = new Error("Empty store details");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStore");
        return reject(err);
      }

      if (!store.id) {
        let err = new Error("Invalid store id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStore");
        return reject(err);
      }

      StoreDao.getStoreById(store.id).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("Store with given id not exists");
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "updateStore");
          return reject(err);
        }

        const oldStore = rows[0];
        const newStore = {}

        newStore.address = store.address || oldStore['address'];
        newStore.longitude = store.longitude || oldStore['longtude'];
        newStore.latitude = store.latitude || oldStore['latitude'];
        newStore.district = store.district || oldStore['district'];
        newStore.province = store.province || oldStore['province'];
        newStore.managerId = store.managerId || oldStore['manager_user_id'];
        newStore.phone = store.phone || oldStore['branch_phone'];
        newStore.logo = store.logo || oldStore['logo'];
        newStore.displayImage = store.displayImage || oldStore['display_image'];
        newStore.slogan = store.slogan || oldStore['slogan'];
        newStore.onlineStatus = store.onlineStatus || oldStore['online_status'];

        StoreDao.updateStoreById(store.id, newStore).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  updateStoreOnlineStatus(store) {
    return new Promise((resolve, reject)=>{
      if (!store) {
        let err = new Error("Empty store details");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStoreOnlineStatus");
        return reject(err);
      }

      if (!store.id) {
        let err = new Error("Invalid store id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStoreOnlineStatus");
        return reject(err);
      }

      if (!store.active) {
        let err = new Error("Invalid statuss");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStoreOnlineStatus");
        return reject(err);
      }

      StoreDao.getStoreById(store.id).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("Store with given id not exists");
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "updateStore");
          return reject(err);
        }

        StoreDao.updateStoreoOnlineStatusById(store.id, store.active).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  updateStoreOnlineStatusById(store) {
    return new Promise((resolve, reject)=>{
      if (!store) {
        let err = new Error("Empty store details");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStoreOnlineStatusById");
        return reject(err);
      }

      if (!store.id) {
        let err = new Error("Invalid store id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStoreOnlineStatusById");
        return reject(err);
      }

      StoreDao.getStoreById(store.id).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("Store with given id not exists");
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "updateStoreOnlineStatusById");
          return reject(err);
        }

        StoreDao.updateStoreOnlineStatusById(store.id, store.onlineStatus).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  getStoreById(storeId) {
    return new Promise((resolve, reject)=>{
      if (!storeId) {
        let err = new Error("Invalid store id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStore");
        return reject(err);
      }

      StoreDao.getStoreById(storeId).then((rows)=> {
        if(rows[0]) {
          resolve({
            status: Constants.SUCCESS,
            store: _this._buildStore(rows[0])
          })
        } else {
          resolve({
            status: Constants.NOT_FOUND,
            message: "Requested Invalid Store Id"
          })
        }
        
      }).catch(reject);
    })
  }

  _buildStore(store) {
 //console.log("^^^^^^^^^^^^^^^^^^^^^^^_______________________________^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&&&&&&&&&&&&&&&")
 //  console.log(store)
    const newStore = {};
    newStore.id = store['id'];
    newStore.orgId = store['org_id'];
    newStore.branchName = store['branch_name'];
    newStore.address = store['address'];
    newStore.longitude = store['longtude'];
    newStore.latitude = store['latitude'];
    newStore.district = store['district'];
    newStore.province = store['province'];
    newStore.managerId = store['manager_user_id'];
    newStore.phone = store['branch_phone'];
    newStore.logo = store['logo'];
    newStore.displayImage = store['display_image'];
    newStore.active = store['active'];
    newStore.onlineStatus = store['online_status'] == 1 ? true : false;
    newStore.slogan = store['slogan'];
    newStore.orgLogoId = store['org_logo_id'];
    newStore.branchLogoImage = store['branch_logo_image'];
    newStore.branchDisplayImage = store['branch_display_image'];
//console.log("___________________________newStore____^^^^^^^^^^^^^^^------------------------------------------------------------")

//console.log(newStore)
console.log(store['branch_display_image'])
    return newStore;
  }

  getAllStoresForPartner(partnerId) {
    return new Promise((resolve, reject)=> {
      if (!partnerId) {
        let err = new Error("Invalid partner id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStore");
        return reject(err);
      }

      OrganizationDao.getOrganizationByOrgId(partnerId).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("No partner store exists with given id");
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "createStore");
          return reject(err);
        }

        StoreDao.getStoresBelongToPartner(partnerId).then((rows)=> {
          let stores = [];

          rows.forEach((row)=> {
            stores.push(_this._buildStore(row));
          })

          return resolve({
            status: 200,
            stores: stores
          });
        }).catch(reject);
      }).catch(reject);
    });
  }

getAllStoresForUser(userId) {
    return new Promise((resolve, reject)=> {
      if (!userId) {
        let err = new Error("Invalid userId id");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "updateStore");
        return reject(err);
      }

      OrganizationDao.getOrganizationByUserId(userId).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("No userId store exists with given id");
          err.customMessage = err.message;
          err.appendDetails("StoreModel", "createStore");
          return reject(err);
        }

        StoreDao.getStoresBelongToUser(userId).then((rows)=> {
          let stores = [];

          rows.forEach((row)=> {
            stores.push(_this._buildStore(row));
          })

          return resolve({
            status: 200,
            stores: stores
          });
        }).catch(reject);
      }).catch(reject);
    });
  }


  getProductsByStore(storeId) {
console.log(" getProductsByStore(storeId) 2020")
    return new Promise((resolve, reject)=>{
      if (!storeId) {
        let err = new Error("Invalid Store id");
        err.customMessage = err.message;
        err.appendDetails("Store Model", "getProductsByStore");
        return reject(err);
      }

      StoreDao.getProductsByStore(storeId).then((rows)=> ProductModel._buildProduct(rows, true).then((builtProduct) =>{
        StoreDao.getStoreWithImagesById(storeId).then((storeResult) => {            
            resolve({
              status: Constants.SUCCESS,
              products: builtProduct.products,
              store: this._buildStore(storeResult[0])
            })
        }).catch(reject);        
      }).catch(reject)).catch(reject);
    })
  }

getUserProductsByStore(storeIds) {
    return new Promise((resolve, reject)=>{
      if (!storeIds) {
        let err = new Error("Invalid Store id");
        err.customMessage = err.message;
        err.appendDetails("Store Model", "getProductsByStore");
        return reject(err);
      }
      StoreDao.getUserProductsByStore(storeIds).then((rows)=> ProductModel._buildUserProduct(rows, true).then((builtProduct) =>{
        StoreDao.getUserStoreWithImagesById(storeIds).then((storeResult) => {            
            resolve({
              status: Constants.SUCCESS,
              products: builtProduct.products,
              store: this._buildStore(storeResult[0])
            },console.log("storeResult[0]"), console.log(storeResult[0]))
        }).catch(reject);        
      }).catch(reject)).catch(reject);
    })
  }

  getAllStores(npp, pge){
    return new Promise((resolve, reject) => {      
      let numRows;
      let numPerPage = parseInt(npp, 10) || 1;
      let page = parseInt(pge, 10) || 0;
      let numPages;
      let skip = page * numPerPage;
      
      StoreDao.getStoreCount().then((rows) => {
        numRows = rows[0].rows;
        numPages = Math.ceil(numRows / numPerPage);
        StoreDao.getAllStores(skip, numPerPage).then((organizations) => {
          let orgArray = [];
          for(let org of organizations) {
            orgArray.push(this.getPartnerStoreObject(org));
          }
          let responsePayload = {
            results: orgArray
          };
          responsePayload.status = Constants.SUCCESS;
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined
            }
          }
          else {
            responsePayload.status = Constants.BAD_REQUEST;
            responsePayload.pagination = {
              err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
            }
          } 
          resolve(responsePayload);
        }).catch(reject);
      }).catch(reject);
    });
  }

  getPartnerStoreObject(dbObject) {
console.log("_______________202020202020202020202020__________________ getPartnerStoreObject(dbObject)______________________")
console.log(dbObject)

    let object = {
      orgId: dbObject.org_id,
      name: dbObject.name,
      headOfficeAddress: dbObject.head_office_address,
      contactNo: dbObject.contact_no,
      orgType: dbObject.org_type,
      orgLogo: this.convertBlobToBase64(dbObject.partner_logo),
      bank: dbObject.bank,
      branch: dbObject.branch,
      branchCode: dbObject.branch_code,
      branchId: dbObject.id,
      branchName: dbObject.branch_name,
      branchAddress: dbObject.address,
      branchActive: dbObject.branch_active,
      branchOnlineStatus: dbObject.online_status,
      branchLogo: dbObject.store_logo,
      branchDisplayImage: dbObject.store_display_image,
      longtude: dbObject.longtude,
      latitude: dbObject.latitude,
      district: dbObject.district,
      province: dbObject.province,
      branchPhone: dbObject.branch_phone,
      slogan: dbObject.slogan
    }
    return object;
  }

  convertBlobToBase64(blob) {
    if(blob) {
      let buffer = new Buffer( blob );
      return buffer.toString('base64');
    } else {
      return null;
    }

  }

  getBranchesForUserOrg(user) {
    return new Promise((resolve, reject) => {
      if (!user) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "getBranchesForUserOrg");
        return reject(err);
      }

      if (user['user_type'] === Constants.USER_TYPE.SWYFTR || user['org_id'] === Constants.SWYFTER_ORG_ID) {
        // Swyfter users does not have branches.
        return resolve([]);
      } else if (user['user_type'] === Constants.USER_TYPE.RIDER) {
        let err = new Error("Invalid operation. Can not assign riders to a branch");
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "getBranchesForUserOrg");
        return reject(err);
      } else if (user['user_type'] === Constants.USER_TYPE.PARTNER) {

        return StoreDao.getStoresBelongToPartner(user['org_id']).then((rows) => {
          const result = [];

          rows.forEach((row) => result.push(_this._buildStore(row)));

          return resolve({
            stores: result,
            status: 200
          })
        }).catch(reject);

      } else {
        let err = new Error(`Invalid operation, invalid user type`);
        err.customMessage = err.message;
        err.appendDetails("StoreModel", "getBranchesForUserOrg");
        return reject(err);
      }
    })
  }

}

export default new StoreModel();
