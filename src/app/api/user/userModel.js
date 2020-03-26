import Decorator from '../../helpers/decorator';
import ProfileDao from '../../databases/mysql/profile/profileDao';
import UserAddressDao from '../../databases/mysql/userAddress/userAddressDao';
import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao';
import PermissionDao from '../../databases/mysql/permission/permissionDao';
import RiderDao from '../../databases/mysql/rider/riderDao';
import {generateOtp} from '../../helpers/utility';

import * as constants from '../../helpers/constants';
import OrganizationDao from '../../databases/mysql/organization/organizationDao';
import SmsService from '../../services/sms/smsService';
import { generateFromTemplateForOTP } from '../../helpers/emailUtils';
import EmailClient from '../../../utils/emailClient';

import AddressDao from '../../databases/mysql/userAddress/userAddressDao';

let _this;
/**
 * User Model
 */
class UserModel extends Decorator {

  constructor() {
    super();
    _this = this;
  }

  getCustomerByUserId(userId) {
    return new Promise((resolve, reject)=>{
      if(!userId) {
        let err = new Error("Missing user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "getCustomerByUserId");
        return reject(err);
      }

      return ProfileDao.getUserByEmailOrUserId(userId).then((rows)=>{
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "getCustomerByUserId");
          return reject(err);
        }

        let user = _this._buildCustomerUser(rows[0]);

        return UserAddressDao.getAddressByUserId(userId).then((rows)=>{
          rows.forEach((row)=>{
            user["addressList"].push(_this._buildAddress(row));
          });
          return resolve({
            status: 200,
            data: user
          });
        }).catch(reject);
      }).catch(reject);
    });
  }

  getSystemUserByUserId(userId) {
    return new Promise((resolve, reject)=>{
      if(!userId) {
        let err = new Error("Missing user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "getSystemUserByUserId");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(userId).then((rows)=>{
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "getSystemUserByUserId");
          return reject(err);
        }

        let user = _this._buildSystemUser(rows[0]);

        return resolve({
          status: 200,
          data: user
        });
      }).catch(reject);
    });
  }

  _buildCustomerUser(rawUser) {
    let user = {
      "userId": rawUser["user_id"],
      "firstName": rawUser["first_name"],
      "lastName": rawUser["last_name"],
      "dateOfBirth": rawUser["dob"],
      "email": rawUser["email"],
      "phoneNumber": rawUser["phone_no"],
      "mobileNumber": rawUser["mobile_no"],
      "nic": rawUser["nic"],
      "profilePicId": rawUser["profile_pic_id"],
      "addressList": []
    };

    return user;
  }

  _buildSystemUser(rawUser) {
    let user = {
      "userId": rawUser["user_id"],
      "firstName": rawUser["first_name"],
      "lastName": rawUser["last_name"],
      "dateOfBirth": rawUser["dob"],
      "email": rawUser["email"],
      "phoneNumber": rawUser["phone_no"],
      "mobileNumber": rawUser["mobile_no"],
      "nic": rawUser["nic"],
      "address": rawUser["address"],
      "orgId": rawUser["org_id"],
      "designation": rawUser["designation"],
      "userType": rawUser["user_type"],
      "profilePicId": rawUser["profie_pic_id"],
      "orgName": rawUser["org_name"],
      "branchId": rawUser['org_branch']
    };

    return user;
  }

  _buildAddress(rawAddres) {
    let address = {
      "number": rawAddres["number"],
      "addressLine1": rawAddres["address_line_1"],
      "addressLine2": rawAddres["address_line_2"],
      "district": rawAddres["district"],
      "province": rawAddres["province"],
      "id": rawAddres["id"]
    };

    return address;
  }

  updateCustomerUsereByUserId(userId, user) {
    return new Promise((resolve, reject)=> {
      if (!userId) {
        let err = new Error("Missing user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateCustomerUsereByUserId");
        return reject(err);
      }

      return ProfileDao.getUserByEmailOrUserId(userId).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "updateCustomerUsereByUserId");
          return reject(err);
        }

///let address = {};
//address["addressLine1"] =  user[" fixedAddress"];
//address["addressLine2"] =  user["officeAddress"];
//address["district"] =  "" ;
//address["province"] = "" ;


  //      AddressDao.createUserAddress(address, userId).then((res)=> resolve({
  //        status: 200,
  //        storeId: res["insertId"]
  //      })).catch(reject);

AddressDao.getAddressByUserId(userId).then((rows)=> {

 console.log("---------------------console.log(rows)------------------------------------")
console.log(userId)
console.log(rows)

let oldAddress = rows[0];
          let addressN = {};

          addressN["userId"] = userId;
addressN["address_line_1"] =  user["fixedAddress"] || oldAddress["address_line_1"];
addressN["address_line_2"] =  user["officeAddress"] || oldAddress["address_line_2"];;
addressN["district"] =  "-" ;
addressN["province"] = "-" ;
 console.log("---------------------addressN[user_id]------------------------------------")
console.log(addressN["user_id"])

console.log("---------------------addressN[address_line_1]------------------------------------")
console.log(addressN["address_line_1"])

console.log("---------------------user[ fixedAddress]------------------------------------")
console.log(user["fixedAddress"])

console.log("---------------------user[ officeAddress]------------------------------------")
console.log(user["officeAddress"])






          if(!rows || !rows.length) {

            AddressDao.createUserAddress(addressN, userId).then((res)=> resolve({
              status: 200,
              storeId: res["insertId"]
            })).catch(reject);
    
           
          }

 
  console.log("_______________addressN__________")
console.log(addressN)
          UserAddressDao.updateAddressByUserId(addressN).then(() => resolve({
            status: 200
          })).catch(reject);
        }).catch(reject);



   console.log("------------------------------------------------------------------------------")
        console.log(rows)
        console.log("-------------__________________________________-----------------")
        console.log(rows[0])
 console.log(user)


        let oldUser = rows[0];
        let newUser = {};
        newUser["userId"] = userId;
        newUser["firstName"] = user["firstName"] || oldUser["first_name"];
        newUser["lastName"] = user["lastName"] || oldUser["last_name"];
        newUser["dateOfBirth"] = user["dateOfBirth"] || oldUser["dob"];
        newUser["phoneNumber"] = user["phoneNumber"] || oldUser["phone_no"];
        newUser["mobileNumber"] = user["mobileNumber"] || oldUser["mobile_no"];
        newUser["profilePicId"] = user["profilePicId"] || oldUser["profile_pic_id"];

        return ProfileDao.updateUserByUserId(newUser).then(()=> resolve({status: 200})).catch(reject);
      });
    });
  }

  updateSystemUsereByUserId(userId, user) {
    return new Promise((resolve, reject)=> {
      if (!userId) {
        let err = new Error("Missing user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateSystemUsereByUserId");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(userId).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "updateSystemUsereByUserId");
          return reject(err);
        }

        let oldUser = rows[0];
        let newUser = {};
        newUser["userId"] = userId;
        newUser["firstName"] = user["firstName"] || oldUser["first_name"];
        newUser["lastName"] = user["lastName"] || oldUser["last_name"];
        newUser["dateOfBirth"] = user["dateOfBirth"] || oldUser["dob"];
        newUser["phoneNumber"] = user["phoneNumber"] || oldUser["phone_no"];
        newUser["mobileNumber"] = user["mobileNumber"] || oldUser["mobile_no"];
        newUser["address"] = user["address"] || oldUser["address"];
        newUser["designation"] = user["designation"] || oldUser["designation"];
        newUser["profilePicId"] = user["profilePicId"] || oldUser["profie_pic_id"];
        newUser["branchId"] = user["branchId"] || oldUser["org_branch"];

        return SysUserProfileDao.updateUserByUserId(newUser).then(()=> resolve({status: 200})).catch(reject);
      });
    });
  }

  getCustomerByEmail(email) {
    return new Promise((resolve, reject)=>{
      if(!email) {
        let err = new Error("Missing user email");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "getCustomerByEmail");
        return reject(err);
      }

      return ProfileDao.getUserByEmailOrUserId(null, email).then((rows)=>{
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "getCustomerByEmail");
          return reject(err);
        }

        let user = _this._buildSystemUser(rows[0]);
        let userId = rows[0]["user_id"];

        return UserAddressDao.getAddressByUserId(userId).then((rows)=>{
          rows.forEach((row)=>{
            user["addressList"].push(_this._buildAddress(row));
          });
          return resolve({
            status: 200,
            data: user
          });
        }).catch(reject);
      }).catch(reject);
    });
  }

  getSystemUserByEmail(email) {
    return new Promise((resolve, reject)=>{
      if(!email) {
        let err = new Error("Missing user email");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "getSystemUserByEmail");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows)=>{
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "getSystemUserByEmail");
          return reject(err);
        }

        let user = _this._buildSystemUser(rows[0]);
        return resolve({
          status: 200,
          data: user
        });
      }).catch(reject);
    });
  }

  setPushNotificationId(email, pushNotificationId) {
    return new Promise((resolve, reject)=>{
      if (!email) {
        let err = new Error("Invalid email address, can not find user");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "setPushNotificationId");
        return reject(err);
      }

      if (!pushNotificationId) {
        let err = new Error("Invalid push notification id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "setPushNotificationId");
        return reject(err);
      }

      ProfileDao.getUserByEmailOrUserId(null, email).then((rows)=>{
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "setPushNotificationId");
          return reject(err);
        }

        // let user = rows[0];
        resolve({
          status: 200,
          message: "Device id saved successful"
        });
      }).catch(reject);

    });
  }

  insertAddress(addressObj) {
    return new Promise((resolve, reject)=>{
      if (!addressObj || !addressObj.userId) {
        let err = new Error("Invalid address");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "insertAddress");
        return reject(err);
      }

      if (!addressObj.addressLine1 || addressObj.addressLine1 === "" || !addressObj.district || !addressObj.district === ""
            || !addressObj.province || addressObj.province === "") {
        let err = new Error("Address missing one or more of address line 1, or district or province");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "insertAddress");
        return reject(err);
      }

      ProfileDao.getUserByEmailOrUserId(addressObj.userId).then((rows)=> {
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "insertAddress");
          return reject(err);
        }

        return UserAddressDao.createUserAddress(addressObj, addressObj.userId).then(()=> resolve({
          status: 200
        })).catch(reject)
      }).catch(reject);
    });
  }

  updateAddress(addressObj) {
    return new Promise((resolve, reject)=>{
      if (!addressObj || !addressObj.userId) {
        let err = new Error("Invalid address");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateAddress");
        return reject(err);
      }

      if (!addressObj.addressLine1 || addressObj.addressLine1 === "" || !addressObj.district || addressObj.district === ""
            || !addressObj.province || addressObj.province === "") {
        let err = new Error("Address missing one or more of address line 1, or district or province");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateAddress");
        return reject(err);
      }

      ProfileDao.getUserByEmailOrUserId(addressObj.userId).then((rows)=> {
        if(!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "updateAddress");
          return reject(err);
        }

        UserAddressDao.updateAddressByUserId(addressObj).then(() => resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  removeAddress(addressId) {
    return new Promise((resolve, reject)=>{
      if (!addressId) {
        let err = new Error("Invalid address id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "removeAddress");
        return reject(err);
      }

      UserAddressDao.getAddressByAddressId(addressId).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("Address details cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "removeAddress");
          return reject(err);
        }

        UserAddressDao.removeAddressByAddressId(addressId).then(()=>resolve({status: 200})).catch(reject)
      }).catch(reject)
    });
  }

  getAllUsers(reqUser, active, orgId) {
    let _this = this;
    return new Promise((resolve, reject)=>{

      if (active === 'true') active = 'true';
      else if (active === 'false') active = 'false';
      else active = 'all';

      if (reqUser['org_id'] !== constants.SWYFTER_ORG_ID) {
        orgId = reqUser['org_id']
      } else {
        if (!orgId || orgId === '') orgId = null
      }

      SysUserProfileDao.getAllUsers(active, orgId).then((rows)=>{
        let userArr = [];
        rows.forEach(function (row) {
          userArr.push(_this._buildSystemUser(row));
        });
        return resolve({
          status: 200,
          data: userArr
        })
      }).catch(reject);
    });
  }

  changeUserActiveStatus(reqUser, userId, status) {
    return new Promise((resolve, reject)=> {
      if (!userId) {
        let err = new Error("Invalid user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "changeUserActiveStatus");
        return reject(err);
      }

      if (status === 'activate') {
        status = true;
      } else if (status === 'deactivate') {
        status = false
      } else {
        let err = new Error("Invalid status");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "changeUserActiveStatus");
        return reject(err);
      }

      PermissionDao.getUserPermissions(reqUser['user_id']).then((permissions)=>{
        if (!permissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && !permissions[constants.PERMISSIONS.DEACTIVATE_USERS]) {
          let err = new Error("Does not have permission to deactivate another user");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "changeUserActiveStatus");
          return reject(err);
        }

        SysUserProfileDao.changeUserActiveStatus(userId, status).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  changeCustomerActiveStatus(reqUser, userId, status) {
    return new Promise((resolve, reject)=> {
      if (!userId) {
        let err = new Error("Invalid user id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "changeUserActiveStatus");
        return reject(err);
      }

      if (status === 'activate') {
        status = true;
      } else if (status === 'deactivate') {
        status = false
      } else {
        let err = new Error("Invalid status");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "changeUserActiveStatus");
        return reject(err);
      }

      PermissionDao.getUserPermissions(reqUser['user_id']).then((permissions)=>{
        if (!permissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && !permissions[constants.PERMISSIONS.DEACTIVATE_CUSTOMERS]) {
          let err = new Error("Does not have permission to deactivate another user");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "changeCustomerActiveStatus");
          return reject(err);
        }

        ProfileDao.changeStatusOfCustomerByUserId(userId, status).then(()=> resolve({
          status: 200
        })).catch(reject);
      }).catch(reject);
    });
  }

  updateDeviceId(user, deviceId, deviceOs) {
    return new Promise((resolve, reject)=> {
      if (!user) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateDeviceId");
        return reject(err);
      }

      if (!deviceId) {
        let err = new Error("Invalid deviceId");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateDeviceId");
        return reject(err);
      }

      if (!deviceOs || ['ios', 'android'].indexOf(deviceOs) === constants.NOT_FOUND_INDEX) {
        let err = new Error("Invalid deviceOs");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateDeviceId");
        return reject(err);
      }

      ProfileDao.updateDeviceId(user['user_id'], deviceId, deviceOs).then(()=> resolve({
        status: 200
      })).catch(reject);
    });
  }

  getAllAppUsers(activeStatus) {
    return new Promise((resolve, reject)=>{
      let active = true;

      if (activeStatus === 'false') {
        active = false;
      }

      return ProfileDao.getAllCustomersByStatus(active).then((rows)=> {
        const users = [];
        rows.forEach((row)=> {
          users.push(_this._buildCustomerUser(row));
        });

        return resolve({
          status: 200,
          data: users
        })
      }).catch(reject);
    });
  }

  _validateRiderPartnerAdmin(reqUser) {
    return new Promise((resolve, reject) => {
      if (!reqUser) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "_validateRiderPartnerAdmin");
        return reject(err);
      }

      PermissionDao.getUserPermissions(reqUser['user_id']).then((permissions) => {
        if (!permissions || reqUser['user_type'] === 'partner' || (reqUser['user_type'] === 'rider' && !permissions[constants.PERMISSIONS.RIDER_PARTNER_LOGIN])) {
          let err = new Error("Forbidden login to portal");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "_validateRiderPartnerAdmin");
          return reject(err);
        }

        OrganizationDao.getOrganizationByOrgId(reqUser['org_id']).then((rows) => {
          if (!rows || !rows.length) {
            let err = new Error("Partner organization doesn't exist");
            err.customMessage = err.message;
            err.appendDetails("UserModel", "_validateRiderPartnerAdmin");
            return reject(err);
          }

          const requestUserOrgType = rows[0]['org_type']

          if ([constants.PARTNER_RIDER_TYPE, constants.PARTNER_SWYFTER_TYPE].indexOf(requestUserOrgType) === constants.NOT_FOUND_INDEX) {
            let err = new Error("User does not belong to swyfter nor rider partner");
            err.customMessage = err.message;
            err.appendDetails("UserModel", "_validateRiderPartnerAdmin");
            return reject(err);
          }

          return resolve();
        }).catch(reject)
      }).catch(reject);
    })
  }

  getAllRiderUsersForPartner(orgId) {
    return new Promise((resolve, reject) => {
      if (!orgId) {
        let err = new Error("Invalid partner organization id");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "getAllRiderUsersForPartner");
        return reject(err);
      }

      OrganizationDao.getOrganizationByOrgId(orgId).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Partner organization doesn't exist");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "getAllRiderUsersForPartner");
          return reject(err);
        }

        if (rows[0]['org_type'] !== constants.PARTNER_RIDER_TYPE) {
          return resolve({
            status: 200,
            data: []
          })
        }

        SysUserProfileDao.getAllRiderUsersForPartner(orgId).then((rows) => {
          const riders = []

          rows.forEach((row) => {
            if (!row['permissions'] || row['permissions'].indexOf(constants.PERMISSIONS.RIDER_PARTNER_LOGIN) === constants.NOT_FOUND_INDEX) {
              riders.push(_this._buildRider(row))
            }
          })

          return resolve({
            data: riders,
            status: 200
          })
        }).catch(reject);
      }).catch(reject);
    })
  }

  _buildRider(rawUser) {
    const rider = {
      "userId": rawUser["user_id"],
      "firstName": rawUser["first_name"],
      "lastName": rawUser["last_name"],
      "dateOfBirth": rawUser["dob"],
      "email": rawUser["email"],
      "phoneNumber": rawUser["phone_no"],
      "mobileNumber": rawUser["mobile_no"],
      "nic": rawUser["nic"],
      "address": rawUser["address"],
      "orgId": rawUser["org_id"],
      "designation": rawUser["designation"],
      "userType": rawUser["user_type"],
      "profilePicId": rawUser["profie_pic_id"],
      "orgName": rawUser["org_name"],
      "license": rawUser["license_no"],
      "vehicalNo": rawUser["vehicle_no"],
      "status": rawUser['status']
    };

    return rider;
  }

  updateRiderSpecificInfo(userId, license, vehicalNo, nic, reqUserOrg) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        let err = new Error("Invalid userId");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateRiderSpecificInfo");
        return reject(err);
      }

      if (!license) {
        let err = new Error("Empty license no");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateRiderSpecificInfo");
        return reject(err);
      }

      if (!vehicalNo) {
        let err = new Error("Empty vehicle no");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateRiderSpecificInfo");
        return reject(err);
      }

      if (!nic) {
        let err = new Error("Empty nic");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "updateRiderSpecificInfo");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(userId).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User with given user id not exists");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "updateRiderSpecificInfo");
          return reject(err);
        }

        const user = rows[0];

        if (user['user_type'] !== constants.USER_TYPE.RIDER) {
          let err = new Error("Not a rider user");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "updateRiderSpecificInfo");
          return reject(err);
        }

        if (user['org_id'] !== reqUserOrg) {
          let err = new Error("Forbidden action");
          err.customMessage = err.message;
          err.statusCode = 403
          err.appendDetails("UserModel", "updateRiderSpecificInfo");
          return reject(err);
        }

        RiderDao.createOrUpdateRiderInfo(userId, license, vehicalNo, nic).then(
          ()=> resolve({
            status: 200
          })
        ).catch(reject);
      }).catch(reject);
    });
  }

  validateOTP(user){
    return new Promise((resolve, reject) => {
      if (!user.email) {
        let err = new Error("Empty Email");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "validateOTP");
        return reject(err);
      }

      if (!user.otp) {
        let err = new Error("Empty OTP");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "validateOTP");
        return reject(err);
      }

      return ProfileDao.getUserByEmailOrUserId(null, user.email).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "validateOTP");
          return reject(err);
        }
        if (rows[0].otp === user.otp) {
          ProfileDao.updateOTP(rows[0].user_id, null).then(() => resolve({
            status: 200
          })).catch(reject);
        } else {
          return resolve({
            status: 400,
            message: "Invalid OTP"
          });
        }        
      }).catch(reject);
    });
  }

  sendOTP(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Empty Email");
        err.customMessage = err.message;
        err.appendDetails("UserModel", "sendOTP");
        return reject(err);
      }
      let otp = generateOtp();
      return ProfileDao.getUserByEmailOrUserId(null, email).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("UserModel", "sendOTP");
          return reject(err);
        }
        if(rows[0].otp_retry_count > 0) {
          let otpMessage = constants.OTP_MESSAGE + otp;
          return ProfileDao.updateOTP(rows[0].user_id, otp).then(() => {
            SmsService.sendSms(rows[0].mobile_no, otpMessage).then(()=>{
              let otpRetryCount = rows[0].otp_retry_count;
              otpRetryCount = otpRetryCount - 1;
              ProfileDao.updateOTPCount(rows[0].user_id, otpRetryCount).then().catch(reject); 
              EmailClient.sendEmail({
                to: rows[0].email,
                from: '',
                subject: "One Time Password - Registration",
                html: generateFromTemplateForOTP(otpMessage)
              }).then(()=> resolve({
                status: constants.SUCCESS,
                message: "Maximum OTP Retry(s) availability :"+ otpRetryCount
              })).catch(reject);
            }).catch(reject);
          }).catch(reject);
        } else {
          resolve({
            status: constants.PRECONDITION_REQUIRED,
            message: "Maximum OTP Send Count Reached"
        })
        }
      });
    });
  }

}

export default new UserModel();
