import Decorator from '../../helpers/decorator';
import * as constants from '../../helpers/constants';
import OrganizationDao from '../../databases/mysql/organization/organizationDao';
import PermissionDao from '../../databases/mysql/permission/permissionDao';
import fileUtils from '../../../utils/fileUtils';

let _this;
/**
 * User Model
 */
class PartnerModel extends Decorator {

  constructor () {
    super();
    _this = this;
  }

  _validatePhone(phone) {
    let re = constants.SL_PHONE_REGEX;
    return re.test(phone);
  }

  _buildPartner(dbObject) {
console.log("------------------------------------------------_dbObject-----------------------------------")
    console.log(dbObject)

    let partner = {
      "orgId": dbObject["org_id"],
      "name": dbObject["name"],
      "headOfficeAddress": dbObject["head_office_address"],
      "headOfficeContactNo": dbObject["contact_no"],
      "orgType": dbObject["org_type"],
      "bank": dbObject["bank"],
      "branch": dbObject["branch"],
      "accountNo": dbObject["account_number"],
      "preferedPaymentMethod": dbObject["prefered_payment_method"],
      "branchCode": dbObject["branch_code"],
      "bankSwiftCode": dbObject["bank_swift_code"],
      "pointOfContactName": dbObject["point_of_contact_name"],
      "pointOfContactMobile": dbObject["point_of_contact_mobile"],
      "logoId": dbObject["logo_id"],
      "tags": dbObject["tags"],
      "orgLogoImage": dbObject["given_name"]
    }
 console.log("------------------------------------------------_partner-----------------------------------")
    console.log(partner)

    return partner;
  }

  _buildAndRemoveFieldsOfPartner(dbObject) {
    let partner = _this._buildPartner(dbObject);
    ['orgType', 'bank', 'branch', 'accountNo', 'preferedPaymentMethod',
      'branchCode', 'bankSwiftCode', 'pointOfContactName', 'pointOfContactMobile'].forEach((fieldName)=>{
      delete partner[fieldName];
    })
    return partner;
  }

  createPartner(partner) {
    return new Promise((resolve, reject)=>{
      if (!partner) {
        let err = new Error("Empty partner");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.name) {
        let err = new Error("Partner name can not be empty");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.headOfficeAddress) {
        let err = new Error("Partner head office address can not be empty");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.headOfficeContactNo || !this._validatePhone(partner.headOfficeContactNo)) {
        let err = new Error("Invalid partner head office contact number");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.pointOfContactName) {
        let err = new Error("Partner point of contact name can not be empty");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.pointOfContactMobile || !_this._validatePhone(partner.pointOfContactMobile)) {
        let err = new Error("Invalid partner point of contact phone number");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (!partner.orgType || constants.ALLOWED_ORG_TYPES.indexOf(partner.orgType) === constants.NOT_FOUND_INDEX) {
        let err = new Error("Invalid organization type");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      // payment method is optional but if set it is validated
      if (partner.preferedPaymentMethod &&
        constants.ALLOWED_PAYMENT_METHODS[partner.preferedPaymentMethod] === constants.NOT_FOUND_INDEX) {
        let err = new Error("Invalid payment method.");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "createPartner");
        return reject(err);
      }

      if (partner.tags && Array.isArray(partner.tags) && partner.tags.length) {
        try {
          partner.tags = JSON.stringify(partner.tags)
        } catch (err) {
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "createPartner");
          return reject(err)
        }
      }

      OrganizationDao.searchOrgByName(partner.name).then((rows)=>{

        if(rows.length) {
          let err = new Error(`Organization with this name already exist, ${rows[0].name}`);
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "createPartner");
          return reject(err);
        }

        OrganizationDao.insertOrganization(partner).then((result)=>{
          let orgId = result["insertId"];
          return resolve({
            status: 200,
            orgId: orgId
          })
        }).catch(reject)

      }).catch(reject);

    });
  }

  updatePartner(orgId, partner) {
    return new Promise((resolve, reject)=>{
      if (!orgId) {
        let err = new Error("Invalid partner id");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "updatePartner");
        return reject(err);
      }

      if (!partner) {
        let err = new Error("Invalid partner details");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "updatePartner");
        return reject(err);
      }

      if (partner.tags && Array.isArray(partner.tags) && partner.tags.length) {
        try {
          partner.tags = JSON.stringify(partner.tags)
        } catch (err) {
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "updatePartner");
          return reject(err)
        }
      }

      OrganizationDao.getOrganizationByOrgId(orgId).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("Partner not found");
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "updatePartner");
          return reject(err);
        }

        let oldPartner = rows[0];
        let updateObject = {};

        updateObject.name = partner.name || oldPartner["name"];
        updateObject.headOfficeAddress = partner.headOfficeAddress || oldPartner["head_office_address"];
        updateObject.headOfficeContactNo = partner.headOfficeContactNo || oldPartner["contact_no"];
        updateObject.pointOfContactName = partner.pointOfContactName || oldPartner["point_of_contact_name"];
        updateObject.pointOfContactMobile = partner.pointOfContactMobile || oldPartner["point_of_contact_mobile"];
        updateObject.logoId = partner.logoId || oldPartner["logo_id"];
        updateObject.tags = partner.tags || oldPartner["tags"];
        updateObject.orgId = orgId;

        OrganizationDao.updateOrgByOrgId(updateObject).then(()=> resolve({
          status: 200
        })).catch(reject)
      }).catch(reject)
    });
  }

  getPartnerById(partnerId) {
    return new Promise((resolve, reject)=>{
      if (!partnerId) {
        let err = new Error("Invalid partner id");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "getPartnerById");
        return reject(err);
      }

      OrganizationDao.getOrganizationByOrgId(partnerId).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("Partner not found");
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "updatePartner");
          return reject(err);
        }

        let partner = _this._buildPartner(rows[0]);
        return resolve(partner);
      }).catch(reject)
    });
  }

  getStorePartnerById(partnerId) {
    return new Promise((resolve, reject)=>{
      if (!partnerId) {
        let err = new Error("Invalid partner id");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "getPartnerById");
        return reject(err);
      }

      OrganizationDao.getOrganizationByOrgId(partnerId).then((rows)=> {
        if (!rows || !rows.length) {
          let err = new Error("Partner not found");
          err.customMessage = err.message;
          err.appendDetails("PartnerModel", "updatePartner");
          return reject(err);
        }

        let partner = _this._buildAndRemoveFieldsOfPartner(rows[0]);
        return resolve(partner);
      }).catch(reject)
    });
  }

  searchPartnerByName(keyWord, status) {
    return new Promise((resolve, reject)=>{
      if (!keyWord) {
        keyWord = ""
      }

      if (status === 'active') {
        status = true;
      } else if (status === 'inactive') {
        status = false
      } else {
        let err = new Error("Invalid status");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "searchPartnerByName");
        return reject(err);
      }

      OrganizationDao.searchOrgByName(keyWord, status).then((result)=>{

        const list = [];
        result.forEach((store)=>{
  console.log("_______________________________________________________________________________________________________________________")
          console.log(store)
          if (store['org_type'] !== constants.PARTNER_SWYFTER_TYPE) {
            list.push(_this._buildPartner(store))
          }
        })
 //console.log("___________________________ OrganizationDao.searchOrgByName_______list______________")
      //  console.log(list)
        return resolve({
          data: list || []
        })
      }).catch(reject)
    });
  }

  searchStorePartnerByName(keyWord, status) {
    return new Promise((resolve, reject)=>{
      if (!keyWord) {
        keyWord = "";
      }

      OrganizationDao.searchOrgByNameWithLogo(keyWord, status).then((result)=>{
//console.log("___________________________ OrganizationDao.searchOrgByNameWithLogo_______result______________")
     //   console.log(result)
        const storePartnersOnly = [];
        result.forEach((store)=>{
  console.log("_______________________________________________________________________________________________________________________")
          console.log(store)
          if (store['org_type'] === constants.PARTNER_STORE_TYPE) {
            storePartnersOnly.push(_this._buildAndRemoveFieldsOfPartner(store));
          }
        });
        return resolve(storePartnersOnly || [])
      }).catch(reject)
    });
  }

  changePartnerStatus(reqUser, partnerId, status) {
    return new Promise((resolve, reject) => {
      if (!partnerId) {
        let err = new Error("Invalid partner id");
        err.customMessage = err.message;
        err.appendDetails("PartnerModel", "changePartnerStatus");
        return reject(err);
      }

      if (status === 'activate') {
        status = true;
      } else if (status === 'deactivate') {
        status = false
      } else {
        let err = new Error("Invalid status");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "changePartnerStatus");
        return reject(err);
      }

      PermissionDao.getUserPermissions(reqUser['user_id']).then((permissions)=>{
        if (!permissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && !permissions[constants.PERMISSIONS.MANAGE_PARTNERS]) {
          let err = new Error("Does not have permission to deactivate another user");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "changePartnerStatus");
          return reject(err);
        }

        OrganizationDao.changePartnerStatus(partnerId, status).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);

    });
  }

}

export default new PartnerModel();
