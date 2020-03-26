import * as crypto from 'crypto';
import * as async from 'async';
import Decorator from '../../helpers/decorator';
import * as constants from '../../helpers/constants';
import EmailClient from '../../../utils/emailClient';
import ProfileDao from '../../databases/mysql/profile/profileDao';
import AuthDao from '../../databases/mysql/auth/authDao';
import AddressDao from '../../databases/mysql/userAddress/userAddressDao';
import UserTokenDao from '../../databases/mysql/userToken/userTokenDao';
import OrganiationDao from '../../databases/mysql/organization/organizationDao';
import ForgotPasswordDao from '../../databases/mysql/forgotPassword/forgotPasswordDao';

import SysAuthDao from '../../databases/mysql/sysAuth/sysAuthDao';
import SysUserTokenDao from '../../databases/mysql/sysUserToken/sysUserTokenDao';
import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao';
import PermissionDao from '../../databases/mysql/permission/permissionDao';

import { createPassword, createPasswordHashAndSalt, createRandomSalt } from '../../helpers/passwordUtil';
import logger from '../../../utils/logger'
import { getHost, generateOtp } from '../../helpers/utility';
import { generateFromTemplateAlert, generateFromTemplateForAction, generateFromTemplateForOTP } from '../../helpers/emailUtils';
import SmsService from '../../services/sms/smsService';
import ParamsModel from '../params/paramsModel';

let _this;
/**
 * Auth Model
 */
class AuthModel extends Decorator {

  constructor() {
    super();
    _this = this;
  }

  registerCustomer(user) {
    return new Promise((resolve, reject) => {
      let { password, retypePassword, firstName, lastName, dateOfBirth, email, phoneNo,
        mobileNo, nic, addressList, profilePicId } = user;

      if (!_this._validatePassword(password)) {
        let err = new Error("Password should contain at least..."); //TODO add password conditions
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      if (password !== retypePassword) {
        let err = new Error("Password is not equal to retry password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      if (!email || !_this._validateEmail(email)) {
        let err = new Error("Invalid email address");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      if (!_this._validatePhone(phoneNo)) {
        let err = new Error("Invalid phone number");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      if (!_this._validatePhone(mobileNo)) {
        let err = new Error("Invalid mobile number");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      if (!firstName || !lastName) {
        let err = new Error("Invalid first name or invalid last name");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerCustomer");
        return reject(err);
      }

      return ProfileDao.checkUserExists(email, mobileNo, nic).then((result) => {
        if (result && result.length && result[0]['user_count'] > 0) {
          let err = new Error("User with given email, nic, and mobile number already exist");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "registerCustomer");
          return reject(err);
        }
        let otp = generateOtp();
        return ParamsModel.getParamValues(constants.PARAM.OTP_RETRY_COUNT).then((paramValue) => {
          let otpRetryCount = paramValue.value;
          let createUserReq = { firstName, lastName, email, nic, mobileNo, phoneNo, dateOfBirth, profilePicId, otp, otpRetryCount };

          return ProfileDao.createProfile(createUserReq).then((result) => {
            let userId = result["insertId"];
            let hashedPasswordResult = createPasswordHashAndSalt(password);
            let otpMessage = constants.OTP_MESSAGE + otp;
            return AuthDao.createAuthEntry(userId, hashedPasswordResult.value, hashedPasswordResult.salt).then(() => {
              SmsService.sendSms(mobileNo, otpMessage).then(() => {
                logger.info("OTP Sent TO " + mobileNo);
              }).catch(() => {
                logger.error("OTP Sending Failed TO " + mobileNo);
              });
              EmailClient.sendEmail({
                to: email,
                from: '',
                subject: "One Time Password - Registration",
                html: generateFromTemplateForOTP(otpMessage)
              }).then(() => {
                logger.info("OTP Email Sent TO " + email);
              }).catch(() =>{
                logger.error("OTP Email Sending Failed TO " + email);
              });
              if (addressList && addressList.length) {
                let addressPromises = [];
                addressList.forEach((address) => addressPromises.push(AddressDao.createUserAddress(address, userId)));
                return Promise.all(addressPromises).then(() => resolve({ "status": 200 })).catch(reject);
              }
              return resolve({ "status": 200 });
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  loginCustomer({ userName, password }) {
    return new Promise((resolve, reject) => {
      if (!userName) {
        let err = new Error("Username can not be empty");
        err.appendDetails("AuthModel", "loginCustomer");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!password) {
        let err = new Error("Password can not be empty");
        err.appendDetails("AuthModel", "loginCustomer");
        err.customMessage = err.message;
        return reject(err);
      }

      AuthDao.getUserPasswordDetails(userName).then((result) => {
        if (!result.length) {
          let err = new Error("User with given email not found");
          err.appendDetails("AuthModel", "loginCustomer");
          err.customMessage = err.message;
          return reject(err);
        }

        let cred = result[0];
        if (cred.otp) {
          return resolve({
            status: 406,
            message: "Account OTP not verified"
          });
        }
        let hashedPassword = createPassword(password, cred.salt);

        if (hashedPassword === cred.password) {
          let userId = cred["user_id"];
          return UserTokenDao.invalidateTokensForUser(userId).then(() => {
            crypto.randomBytes(constants.DEFAULT_PWD_LENGTH, (err, buffer) => {
              if (err) return reject(err);
              let token = buffer.toString(constants.HEX);
              return UserTokenDao.insertToken(userId, token, "").then(() => resolve({
                status: 200,
                accessToken: token,
                refreshToken: null,
                userId: userId,
                timeToLiveInMilliSeconds: constants.TOKEN_VALID_PERIOD_MS
              })).catch(reject);
            });
          }).catch(reject);
        }
        return resolve({ status: 401 });

      }).catch(reject);
    });
  }

  loginSystemUser({ userName, password }) {
    return new Promise((resolve, reject) => {
      if (!userName || userName === '') {
        let err = new Error("Username can not be empty");
        err.appendDetails("AuthModel", "loginSystemUser");
        err.statusCode = constants.BAD_REQUEST;
        err.customMessage = err.message;
        return reject(err);
      }

      if (!password) {
        let err = new Error("Password can not be empty");
        err.appendDetails("AuthModel", "loginSystemUser");
        err.statusCode = constants.BAD_REQUEST;
        err.customMessage = err.message;
        return reject(err);
      }

      SysAuthDao.getUserPasswordDetails(userName).then((result) => {
        if (!result.length) {
          let err = new Error("User with given email not found or your account might have deactivated");
          err.appendDetails("AuthModel", "loginSystemUser");
          err.customMessage = err.message;
          return reject(err);
        }

        let cred = result[0];
        let userId = cred["sys_user_id"];

        PermissionDao.getUserPermissions(userId).then((permissions) => {
          if (cred['user_type'] === constants.USER_TYPE.RIDER && !permissions[constants.PERMISSIONS.RIDER_PARTNER_LOGIN]) {
            let err = new Error("User type not allowed to login");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "loginSystemUser");
            return reject(err);
          }

          let hashedPassword = createPassword(password, cred.salt);

          if (hashedPassword !== cred.password) {
            let err = new Error("Invalid Password");
            err.customMessage = err.message;
            err.statusCode = constants.BAD_REQUEST;
            err.appendDetails("AuthModel", "loginSystemUser");
            return reject(err);
          }

          return SysUserTokenDao.invalidateTokensForUser(userId).then(() => {
            crypto.randomBytes(constants.DEFAULT_PWD_LENGTH, (err, buffer) => {
              if (err) return reject(err);
              let token = buffer.toString(constants.HEX);
              return SysUserTokenDao.insertToken(userId, token, "").then(() => resolve({
                status: 200,
                accessToken: token,
                refreshToken: null,
                userId: userId,
                timeToLiveInMilliSeconds: constants.TOKEN_VALID_PERIOD_MS
              })).catch(reject);
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  loginRiderUser({ userName, password }) {
    return new Promise((resolve, reject) => {
      if (!userName) {
        let err = new Error("Username can not be empty");
        err.appendDetails("AuthModel", "loginSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!password) {
        let err = new Error("Password can not be empty");
        err.appendDetails("AuthModel", "loginSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      SysAuthDao.getUserPasswordDetails(userName).then((result) => {
        if (!result.length) {
          let err = new Error("User with given email not found");
          err.appendDetails("AuthModel", "loginSystemUser");
          err.customMessage = err.message;
          return reject(err);
        }

        let cred = result[0];

        if (cred['user_type'] !== constants.USER_TYPE.RIDER) {
          let err = new Error("User type not allowed to login");
          err.appendDetails("AuthModel", "loginRiderUser");
          err.customMessage = err.message;
          return reject(err);
        }

        let hashedPassword = createPassword(password, cred.salt);

        if (hashedPassword === cred.password) {
          let userId = cred["sys_user_id"];
          return SysUserTokenDao.invalidateTokensForUser(userId).then(() => {
            crypto.randomBytes(constants.DEFAULT_PWD_LENGTH, (err, buffer) => {
              if (err) return reject(err);
              let token = buffer.toString(constants.HEX);
              return SysUserTokenDao.insertToken(userId, token, "").then(() => resolve({
                status: 200,
                accessToken: token,
                refreshToken: null,
                userId: userId,
                timeToLiveInMilliSeconds: constants.TOKEN_VALID_PERIOD_MS
              })).catch(reject);
            });
          }).catch(reject);
        }
        return resolve({ status: 401 });
      }).catch(reject);
    });
  }

  registerSystemUser(systemUser, host) {
    return new Promise((resolve, reject) => {
      let { firstName, lastName, dateOfBirth, email, phoneNo,
        mobileNo, nic, userType, address, orgId, designation, profilePicId } = systemUser;

      if (!email || !_this._validateEmail(email)) {
        let err = new Error("Invalid email address");
        err.appendDetails("AuthModel", "registerSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!orgId) {
        let err = new Error("Invalid organization");
        err.appendDetails("AuthModel", "registerSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!_this._validatePhone(mobileNo)) {
        let err = new Error("Invalid mobile number");
        err.appendDetails("AuthModel", "registerSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!_this._validateNic(nic)) {
        let err = new Error("Invalid NIC");
        err.appendDetails("AuthModel", "registerSystemUser");
        err.customMessage = err.message;
        return reject(err);
      }

      if (!firstName || !lastName) {
        let err = new Error("Invalid first name or invalid last name");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerSystemUser");
        return reject(err);
      }

      if (constants.ALLOWED_USER_TYPES.indexOf(userType) === constants.NOT_FOUND_INDEX) {
        let err = new Error("User type not allowed to register");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "registerSystemUser");
        return reject(err);
      }

      return OrganiationDao.getOrganizationByOrgId(orgId).then((result) => {
        if (!result || !result.length) {
          let err = new Error("Organization user works, does not exist");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "registerSystemUser");
          return reject(err);
        }

        return SysUserProfileDao.checkUserExists(email, mobileNo, nic).then((result) => {
          if (result && result.length && result[0]['user_count'] > 0) {
            let err = new Error("User with given email, nic, and mobile number already exist");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "registerSystemUser");
            return reject(err);
          }

          let tempPassword = createRandomSalt(constants.RANDOM_PWD_LENGTH);

          let createUserReq = { firstName, lastName, email, nic, mobileNo, phoneNo, userType, dateOfBirth, address, orgId, designation, profilePicId };

          return SysUserProfileDao.createProfile(createUserReq).then((result) => {
            let userId = result["insertId"];
            let hashedPasswordResult = createPasswordHashAndSalt(tempPassword);

            return SysAuthDao.createAuthEntry(userId, hashedPasswordResult.value, hashedPasswordResult.salt).then(() => {
              EmailClient.sendEmail({
                to: email,
                from: '',
                subject: "Temporary password to access Swyftr Account",
                html: _this._generateTempPasswordEmail(host, tempPassword, email, firstName, lastName)
              }).then(() => resolve({
                "status": 200,
                "data": {
                  userId: userId
                }
              })).catch(reject);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject)
    });
  }

  sendResetPasswordLink(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Email can not be empty");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "sendResetPasswordLink");
        return reject(err);
      }

      ProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User with given email not found");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "sendResetPasswordLink");
          return reject(err);
        }

        let passwordResetToken = createRandomSalt(constants.CUSTOMER_RESET_PWD_TOKEN_LENGTH);
        let profile = rows[0];

        return ForgotPasswordDao.saveResetPasswordData(email, profile["user_id"], passwordResetToken,
          constants.RESET_PWD_USER_TYPES.CUSTOMER).then(() => {
            EmailClient.sendEmail({
              to: email,
              from: '',
              subject: "Reset Password Success",
              html: _this._generateResetEmailForCustomer(passwordResetToken, profile["first_name"], profile["last_name"])
            }).then(() => resolve({
              "status": 200,
              "message": `Reset password link sent to ${email}`
            })).catch(reject);
          }).catch(reject);
      }).catch(reject);
    });
  }

  resetCustomerPasswordWithToken({ token, newPassword, retypePassword }) {
console.log("resetCustomerPasswordWithToken-------------------------------------");
console.log(token);
console.log(newPassword);
console.log(retypePassword );
    return new Promise((resolve, reject) => {
      if (!token) {
        let err = new Error("Empty reset password token");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "resetCustomerPasswordWithToken");
        return reject(err);
      }

      if (!newPassword) {
        let err = new Error("Empty new password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "resetCustomerPasswordWithToken");
        return reject(err);
      }

      if (newPassword !== retypePassword) {
        let err = new Error("New password not equal to retyped password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "resetCustomerPasswordWithToken");
        return reject(err);
      }

      return ForgotPasswordDao.getValidEntryByTokenAndUserType(token, constants.RESET_PWD_USER_TYPES.CUSTOMER).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid reset password token");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "resetCustomerPasswordWithToken");
          return reject(err);
        }

        const fpRecord = rows[0]
        const hashedNewPassword = createPasswordHashAndSalt(newPassword);

        AuthDao.updatePasswordOfUser(fpRecord['user_id'], hashedNewPassword.value, hashedNewPassword.salt).then(() => {
          ForgotPasswordDao.deleteEntryByToken(token).then(() => resolve({
            status: 200
          })).catch(reject);
        }).catch(reject)
      }).catch(reject);
    });
  }

  sendSysUserResetPasswordLink(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Email can not be empty");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "sendSysUserResetPasswordLink");
        return reject(err);
      }

      const host = getHost();
  console.log(host);
      SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User with given email not found");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "sendSysUserResetPasswordLink");
          return reject(err);
        }
//console.log(rows);

        let passwordResetToken = createRandomSalt(constants.RESET_PWD_TOKEN_LENGTH);
        let profile = rows[0];
//console.log(passwordResetToken );
console.log(rows[0]);


        return ForgotPasswordDao.saveResetPasswordData(email, profile["user_id"],
          passwordResetToken, constants.RESET_PWD_USER_TYPES.SYS_USER).then(() => {
console.log(email);
            EmailClient.sendEmail({


              to: email,
              from: '',
              subject: "Reset Password Success",
              html: _this._generateResetEmail(host, passwordResetToken, profile["first_name"], profile["last_name"])
            }).then(() => resolve({
              "status": 200,
              "message": `Reset password link sent to ${email}`
            })).catch(reject);
          }).catch(reject);
      }).catch(reject);
    });
  }

  _generateTempPasswordEmail(host, tempPassword, email, firstName, lastName) {
    const topic = 'Welcome To Swyftr'
    const content = `Hi, ${firstName} ${lastName}, We warmly welcome you to swyftr family. Your account details are as below.<br><br><b>User Name: ${email}</b><br><b>Password: ${tempPassword}</b> <br><br>`

    return generateFromTemplateAlert(topic, content, false);
  }

  _generateResetEmail(host, token, firstName, lastName) {
console.log(host);
console.log(token);

console.log("firstName firstName firstName firstName firstName firstName firstName ---------------------------------------------------");

console.log(firstName);

console.log(lastName);


    const para1 = `Dear ${firstName} ${lastName},`
    const para2 = `Your password has been reset and please click the below button to insert new password and proceed.`
    const actionUrl = `${host}/reset-password?token=${token}`
    const actionButton = "Reset Password"

    return generateFromTemplateForAction(para1, para2, actionUrl, actionButton);
  }

  _generateResetEmailForCustomer(token, firstName, lastName) {
    const topic = 'Rest Your App Password'
    const content = `To continue with resetting your app password, please use the token <b style="font-size: 18px">&ldquo;${token}&rdquo;</b>`

    return generateFromTemplateAlert(topic, content, getHost())
  }

  _validateEmail(email) {
    let re = constants.EMAIL_REGEX;
    return re.test(email);
  }

  _validatePhone(phone) {
    let re = constants.SL_PHONE_REGEX;
    return re.test(phone);
  }

  _validateNic(nic) {
    let re = constants.SL_NIC_REGEX;
    return re.test(nic);
  }

  _validatePassword() {
    //TODO add password conditions
    return true;
  }

  updateSysUserPassword(email, newPassword, retypePassword, oldPassword) {
    return new Promise((resolve, reject) => {
      if (!newPassword) {
        let err = new Error("Invalid new password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updatePassword");
        return reject(err);
      }

      if (!oldPassword) {
        let err = new Error("Empty old password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updatePassword");
        return reject(err);
      }

      if (newPassword !== retypePassword) {
        let err = new Error("New password and re typed new password does not match");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updatePassword");
        return reject(err);
      }

      SysAuthDao.getUserPasswordDetails(email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid User");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "updatePassword");
          return reject(err);
        }

        let cred = rows[0];

        let hashedPassword = createPassword(oldPassword, cred.salt);
        if (hashedPassword !== cred.password) {
          let err = new Error("New password and old password does not match");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "updatePassword");
          return reject(err);
        }

        let hashedNewPassword = createPasswordHashAndSalt(newPassword);

        SysAuthDao.updatePasswordOfUser(cred['sys_user_id'], hashedNewPassword.value, hashedNewPassword.salt).then(
          () => resolve({ status: 200 })
        ).catch(reject)
      }).catch(reject)
    });
  }

  __validateForUser(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Invalid user name");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "__validateForUser");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "updateRiderByRider");
          return reject(err);
        }

        let oldUser = rows[0];

        if (oldUser['email'] !== email) {
          let err = new Error("Invalid operation");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "__validateForUser");
          return reject(err);
        }

        if (oldUser['user_type'] === constants.USER_TYPE.RIDER) {
          PermissionDao.getUserPermissions(oldUser['user_id']).then((permissions) => {
            if (!permissions[constants.PERMISSIONS.RIDER_PARTNER_LOGIN]) {
              let err = new Error("Not valid user type");
              err.customMessage = err.message;
              err.appendDetails("AuthModel", "__validateForUser");
              return reject(err);
            }
            return resolve()
          }).catch(reject)
        }

        return resolve()
      });
    })
  }

  addOrRemovePermissionsToNewUser(superUserEmail, newUserId, permissionArr) {
    return new Promise((resolve, reject) => {
      if (!superUserEmail) {
        let err = new Error("Invalid super user");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
        return reject(err);
      }

      if (!newUserId) {
        let err = new Error("Invalid user id");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
        return reject(err);
      }

      if (!Array.isArray(permissionArr)) {
        let err = new Error("Invalid permission set");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, superUserEmail).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Super user does not exists ");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
          return reject(err);
        }

        const supperUser = rows[0]

        SysUserProfileDao.getUserByEmailOrUserId(newUserId).then((newUserRow) => {
          if (!newUserRow || !newUserRow.length) {
            let err = new Error("User does not exists ");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
            return reject(err);
          }

          const newUser = newUserRow[0]

          if (supperUser['user_type'] !== constants.USER_TYPE.SWYFTR && supperUser['org_id'] !== newUser['org_id']) {
            let err = new Error("Invalid operation, you can change permissions for users under your organization only");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
            return reject(err);
          }

          let superUserId = supperUser['user_id'];

          PermissionDao.getUserPermissions(superUserId).then((allPermissions) => {
            if (!allPermissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && !allPermissions[constants.PERMISSIONS.GRANT_PERMISSIONS]) {
              let err = new Error("Super user does not have permission to grant others permissions ");
              err.customMessage = err.message;
              err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
              return reject(err);
            }

            if (!allPermissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && (superUserId === newUser["user_id"])) {
              let err = new Error("You cant change your permissions");
              err.customMessage = err.message;
              err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
              return reject(err);
            }

            let toGrantPermissions = [];
            let toRevokePermissions = [];

            permissionArr.forEach((perm) => {
              if (perm.allowed) {
                toGrantPermissions.push([newUserId, perm.permissionId])
              } else {
                toRevokePermissions.push([newUserId, perm.permissionId])
              }
            })

            async.eachLimit(toGrantPermissions, constants.ASYNC_LIMIT, (perm, cb) => {
              PermissionDao.insertPermissionForUser(...perm).then(cb).catch((err) => {
                logger.error("Error granting permission", err)
                cb()
              })
            }, () => {
              async.eachLimit(toRevokePermissions, constants.ASYNC_LIMIT, (perm, cb) => {
                PermissionDao.revokePermission(...perm).then(cb).catch((err) => {
                  logger.error("Error revoking permission", err)
                  cb()
                })
              }, () => resolve({
                status: 200
              }))
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  getAllSystemPermissions(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "getAllSystemPermissions");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User does not exists ");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "getAllSystemPermissions");
          return reject(err);
        }

        const userId = rows[0]['user_id'];

        PermissionDao.getUserPermissions(userId).then((permissions) => {
          if (permissions[constants.PERMISSIONS.SWYFTR_SUPER_USER]) {
            PermissionDao.getAllPermissionTypes().then((permissions) => resolve({
              data: permissions,
              status: 200
            })).catch(reject);
          } else {
            PermissionDao.getAllPermissionTypeForUser(userId).then((permissions) => resolve({
              data: permissions,
              status: 200
            })).catch(reject);
          }
        }).catch(reject);
      }).catch(reject)
    });
  }

  getPermissionsOfUser(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "getPermissionsOfUser");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User does not exists ");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "getPermissionsOfUser");
          return reject(err);
        }

        const userId = rows[0]['user_id'];

        PermissionDao.getUserPermissions(userId).then((permissions) => resolve({
          data: permissions,
          status: 200
        })).catch(reject);
      }).catch(reject)
    });
  }

  getAllowedPermissionsNamesForUser(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        let err = new Error("Invalid user");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "getAllowedPermissionsNamesForUser");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User does not exists ");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "getAllowedPermissionsNamesForUser");
          return reject(err);
        }

        const userId = rows[0]['user_id'];

        PermissionDao.getAllPermissionTypeForUser(userId).then((permissions) => {
          const permissionArr = [];
          permissions.forEach((perm) => {
            permissionArr.push(perm['name'])
          })
          return resolve({
            status: 200,
            data: permissionArr
          })
        }).catch(reject);
      }).catch(reject)
    });
  }

  getPermissionsOfUserByUserId(superUserEmail, otherUserId) {
    return new Promise((resolve, reject) => {
      if (!superUserEmail) {
        let err = new Error("Invalid super user");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "getPermissionsOfUserByUserId");
        return reject(err);
      }

      if (!otherUserId) {
        let err = new Error("Invalid user id");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "getPermissionsOfUserByUserId");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, superUserEmail).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("Super user does not exists ");
          err.customMessage = err.message;
          err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
          return reject(err);
        }

        const supperUser = rows[0]

        SysUserProfileDao.getUserByEmailOrUserId(otherUserId).then((newUserRow) => {
          if (!newUserRow || !newUserRow.length) {
            let err = new Error("User does not exists ");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
            return reject(err);
          }

          PermissionDao.getUserPermissions(supperUser['user_id']).then((allPermissions) => {
            if (!allPermissions[constants.PERMISSIONS.SWYFTR_SUPER_USER] && !allPermissions[constants.PERMISSIONS.GRANT_PERMISSIONS]) {
              let err = new Error("Super user does not have permission to grant others permissions ");
              err.customMessage = err.message;
              err.appendDetails("AuthModel", "addOrRemovePermissionsToNewUser");
              return reject(err);
            }

            return PermissionDao.getAllPermissionTypeForUser(otherUserId).then((permissions) => resolve({
              data: permissions,
              status: 200
            })).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  updateSysUserPasswordByToken(token, password, retypePassword) {
 console.log("updateSysUserPasswordByToken");
	 console.log(token);
    return new Promise((resolve, reject) => {
      if (!token) {
        let err = new Error("Invalid reset password token");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updateSysUserPasswordByToken");
        return reject(err);
      }

      if (!password) {
        let err = new Error("Invalid new password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updateSysUserPasswordByToken");
        return reject(err);
      }

      if (!retypePassword || password !== retypePassword) {
        let err = new Error("Password should equal to retype password");
        err.customMessage = err.message;
        err.appendDetails("AuthModel", "updateSysUserPasswordByToken");
        return reject(err);
      }

      ForgotPasswordDao.getValidEntryByTokenAndUserType(token, constants.RESET_PWD_USER_TYPES.SYS_USER).then((rows) => {
	 console.log("getValidEntryByTokenAndUserType");
	 console.log(rows);
        if (!rows || !rows.length) {
          let err = new Error("Invalid token, or token has expired bbbbbbbbbbbb");
          err.customMessage = err.message;
          err.errorStatusCode = 401;
          err.appendDetails("AuthModel", "updateSysUserPasswordByToken");
          return reject(err);
        }

        const entry = rows[0];

        SysUserProfileDao.getUserByEmailOrUserId(null, entry['email']).then((rows) => {
          if (!rows || !rows.length) {
            let err = new Error("Invalid user. User does not exists");
            err.customMessage = err.message;
            err.appendDetails("AuthModel", "updateSysUserPasswordByToken");
            return reject(err);
          }

          const hashedNewPassword = createPasswordHashAndSalt(password);

          SysAuthDao.updatePasswordOfUser(rows[0]['user_id'], hashedNewPassword.value, hashedNewPassword.salt).then(() => {
            ForgotPasswordDao.deleteEntryByToken(token).then(() => resolve({ status: 200 })).catch(reject)
          }).catch(reject)
        }).catch(reject)
      }).catch(reject)
    });
  }
}

export default new AuthModel();
