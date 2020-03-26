import Decorator from '../../helpers/decorator';
import {createPasswordHashAndSalt, createPassword} from '../../helpers/passwordUtil';
import * as constants from '../../helpers/constants';
import * as async from 'async'
import geoLib from 'geolib';

import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao';
import SysAuthDao from '../../databases/mysql/sysAuth/sysAuthDao'
import OrderDao from '../../databases/mysql/order/orderDao';
import RiderDao from '../../databases/mysql/rider/riderDao'

import FireStoreService from '../../services/firestore/fireStoreServices';
import PermissionDao from '../../databases/mysql/permission/permissionDao'

import OrderModel from '../order/orderModel';
import logger from '../../../utils/logger'

let _this;
/**
 * Rider Model
 */
class RiderModel extends Decorator {

  constructor () {
    super();
    _this = this;
  }

  updateRiderByRider(email, rider) {
    return new Promise((resolve, reject)=> {
      if (!rider) {
        let err = new Error("Missing update information");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "updateRiderByRider");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "updateRiderByRider");
          return reject(err);
        }

        let oldUser = rows[0];
        
        let newUser = {};
        newUser["email"] = email;
        newUser["firstName"] = rider["firstName"] || oldUser["first_name"];
        newUser["lastName"] = rider["lastName"] || oldUser["last_name"];
        newUser["dateOfBirth"] = rider["dateOfBirth"] || oldUser["dob"];
        newUser["phoneNumber"] = rider["phoneNumber"] || oldUser["phone_no"];
        newUser["mobileNumber"] = oldUser["mobile_no"];
        newUser["designation"] = oldUser["designation"];
        newUser["profilePicId"] = rider["profilePicId"] || oldUser["profie_pic_id"];
        newUser["branchId"] = null; // Rider users does not have a branch

        return SysUserProfileDao.updateUserByEmail(newUser).then(()=> resolve({status: 200})).catch(reject);
      });
    });
  }

  updatePassword(email, newPassword, retypePassword, oldPassword) {
    return new Promise((resolve, reject)=>{
      if (!newPassword) {
        let err = new Error("Invalid new password");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "updatePassword");
        return reject(err);
      }

      if (!oldPassword) {
        let err = new Error("Empty old password");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "updatePassword");
        return reject(err);
      }

      if (newPassword !== retypePassword) {
        let err = new Error("New password and re typed new password does not match");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "updatePassword");
        return reject(err);
      }

      SysAuthDao.getUserPasswordDetails(email).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("Invalid User");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "updatePassword");
          return reject(err);
        }

        let cred = rows[0];

        let hashedPassword = createPassword(oldPassword, cred.salt);
        if(hashedPassword !== cred.password) {
          let err = new Error("New password and old password does not match");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "updatePassword");
          return reject(err);
        }

        let hashedNewPassword = createPasswordHashAndSalt(newPassword);

        SysAuthDao.updatePasswordOfUser(cred['sys_user_id'], hashedNewPassword.value, hashedNewPassword.salt).then(
          ()=> resolve({status: 200})
        ).catch(reject)
      }).catch(reject)
    });
  }

  getRidersOrderHistory(email) {
    return _this._getOrderForUserByStatus(email, [constants.ORDER_STATUS.DELIVERED]);
  }

  _getOrderForUserByStatus(email, statusArr) {
    return new Promise((resolve, reject)=>{
      if (!email) {
        let err = new Error("Invalid user id or email");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "_getOrderForUserByStatus");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows)=>{
        if (!rows || !rows.length) {
          let err = new Error("Invalid User");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "_getOrderForUserByStatus");
          return reject(err);
        }

        const user = rows[0];
        OrderDao.getOrdersAndCustomerByRiderIdAndStatus(user['user_id'], statusArr).then((rows)=> {
          const data = []
          rows.forEach((row) => data.push(_this._buildOrderForRider(row)))

          return resolve({
            status: 200,
            data: data
          })
        }).catch(reject);
      }).catch(reject);
    });
  }

  _buildOrderForRider(order) {
    const newOrder = {};

    newOrder['orderId'] = order['id'];
    newOrder['deliveryAddress'] = order['order_address'];
    newOrder['customerId'] = order['customer'];
    newOrder['orderDate'] = order['order_date'];
    newOrder['status'] = order['status'];
    newOrder['orgId'] = order['org_id'];
    newOrder['branchId'] = order['branch_id'];
    newOrder['orgName'] = order['org_name'];
    newOrder['branchName'] = order['branch_name'];
    newOrder['latitude'] = order['lat'];
    newOrder['longitude'] = order['long'];
    newOrder['bLatitude'] = order['b_latitude'];
    newOrder['bLongitude'] = order['b_longtude'];
    newOrder['deliveryDate'] = order['delivery_date'];
    newOrder['deliveryETA'] = order['delivery_eta'];
    newOrder['qrImageId'] = order['qr'];
    newOrder['riderViewed'] = order['rider_viewed'];
    newOrder['cusName'] = order['cus_name'];
    newOrder['cusNic'] = order['nic'];
    newOrder['cusMobile'] = order['mobile_no'];
    newOrder['writtenAddress'] = order['written_address'];
    newOrder['paymentStatus'] = order['payment_status'];
    newOrder['total'] = order['total'];
    newOrder['cusEmail'] = order['cus_email'];

    return newOrder;
  }

  getNewOrdersForRider(email) {
    return _this._getOrderForUserByStatus(email, [constants.ORDER_STATUS.ACCEPTED, constants.ORDER_STATUS.READY_TO_PICKUP]);
  }

  getOnGoingOrdersForRider(email) {
    return _this._getOrderForUserByStatus(email, [constants.ORDER_STATUS.DISPATCHED]);
  }

  __validateForRider(email) {
    return new Promise((resolve, reject)=> {
      if (!email) {
        let err = new Error("Invalid user name");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "__validateForRider");
        return reject(err);
      }

      return SysUserProfileDao.getUserByEmailOrUserId(null, email).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error("User cannot be found");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "updateRiderByRider");
          return reject(err);
        }

        let oldUser = rows[0];

        if (oldUser['email'] !== email) {
          let err = new Error("Invalid operation");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "__validateForRider");
          return reject(err);
        }
        
        if (oldUser['user_type'] !== constants.USER_TYPE.RIDER) {
          let err = new Error("Not a rider");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "__validateForRider");
          return reject(err);
        }

        return resolve()
      });
    })
  }

  changeRiderStatus({status, riderId}) {
    return new Promise((resolve, reject) => {
console.log("status")
console.log(status)
console.log("riderId")
console.log(riderId)
      if (!status) {
        let err = new Error("Rider status is empty");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "changeRiderStatus");
        return reject(err);
      }

      if ([constants.RIDER_STATUS.OFFLINE, constants.RIDER_STATUS.AVAILABLE].indexOf(status) === constants.NOT_FOUND_INDEX) {
        let err = new Error("Rider invalid status");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "changeRiderStatus");
        return reject(err);
      }

      RiderDao.getRiderInfoByUserId(riderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid Rider");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "changeRiderStatus");
          return reject(err);
        }

        const rider = rows[0]
console.log("rider ")
console.log(rider )
 


        switch (status) {
          case constants.RIDER_STATUS.OFFLINE:

            if (rider['status'] !== constants.RIDER_STATUS.AVAILABLE) {
              let err = new Error(`Invalid status change for rider ${riderId}, old_status=${rider['status']}, new_status=${status}`);
              err.customMessage = err.message;
              err.appendDetails("RiderModel", "changeRiderStatus");
              return reject(err);
            }

            RiderDao.updateRiderStatus(riderId, status).then(() => resolve({
              status: 200
            })).catch(reject)

            break;

          case constants.RIDER_STATUS.AVAILABLE:

            if (rider['status'] !== constants.RIDER_STATUS.OFFLINE) {
              let err = new Error(`Invalid status change for rider ${riderId}, old_status=${rider['status']}, new_status=${status}`);
              err.customMessage = err.message;
              err.appendDetails("RiderModel", "changeRiderStatus");
              return reject(err);
            }

            RiderDao.updateRiderStatus(riderId, status).then(() => resolve({
              status: 200
            })).catch(reject)

            break;

          default: {

            const err = new Error(`Status change via API not supported for new_status=${status}`);
            err.customMessage = err.message;
            err.appendDetails("RiderModel", "changeRiderStatus");
            reject(err);
          } break;
        }
      }).catch(reject)
    });
  }

  acceptOrderConsent({orderId, riderId}) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        let err = new Error("Invalid Order Id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "acceptOrderConsent");
        return reject(err);
      }

      RiderDao.getRiderInfoByUserId(riderId).then((rows)=> {
        if (!rows || !rows.length) {
          const err = new Error(`Invalid rider id`);
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "changeRiderStatus");
          return reject(err)
        }

        const rider = rows[0]

        OrderDao.updateOrderConsent(orderId, riderId).then(() => {

          if (rider['status'] !== constants.RIDER_STATUS.ASSIGNED) return resolve({status: 200})

          RiderDao.updateRiderStatus(riderId, constants.RIDER_STATUS.DELIVERY_ACCEPTED).then(
            () => resolve({status: 200})
          ).catch(reject)
        }).catch(reject)
      }).catch(reject)
    });
  }

  getLastKnownLocationForRider(riderId, reqUser) {
    return new Promise((resolve, reject) => {
      if (!riderId) {
        let err = new Error("Invalid Rider Id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "getLastKnownLocationForRider");
        return reject(err);
      }

      RiderDao.getRiderForAdmin(riderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid rider");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "getLastKnownLocationForRider");
          return reject(err);
        }

        const rider = rows[0]

        if (rider['org_id'] !== reqUser['org_id']) {
          let err = new Error("Invalid operation");
          err.customMessage = err.message;
          err.statusCode = constants.UNAUTHORIZED;
          err.appendDetails("RiderModel", "getLastKnownLocationForRider");
          return reject(err);
        }

        PermissionDao.isUserHavePermission(reqUser['user_id'], constants.PERMISSIONS.RIDER_PARTNER_LOGIN).then(havePermission => {
          if (!havePermission) {
            let err = new Error("User does not have permission to carry out this request");
            err.customMessage = err.message;
            err.statusCode = constants.UNAUTHORIZED;
            err.appendDetails("RiderModel", "getLastKnownLocationForRider");
            return reject(err);
          }

          _this._queryForRider(riderId).then(snapshot => {
            const riderLoc = snapshot.docs.length? snapshot.docs[0].data() : undefined

            if (riderLoc) {
              riderLoc.status = rider['status']
              riderLoc.name = `${rider['first_name']} ${rider['last_name']}`
              riderLoc.mobile = rider['mobile_no']
            }

            return resolve({
              status: 200,
              data: riderLoc
            })
          }).catch(reject)
        }).catch(reject)
      }).catch(reject)
    })
  }

  _queryForRider(riderId) {
    return FireStoreService.queryCollection(constants.LIVE_LOCATION_COLLECTION, {
      key: constants.LIVE_LOCATION_ATTRIBUTES.RIDER_ID,
      value: `${riderId}`,
      operator: constants.FIRE_QUERY_OPERATORS.EQ
    })
  }

  getLocationOfRidersInOrg(orgId) {
    return new Promise((resolve, reject) => {
      if (!orgId) {
        let err = new Error("Invalid rider partner");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "getLocationOfRidersInOrg");
        return reject(err);
      }

      RiderDao.getAllRidersOfOrg(orgId).then((rows) => {
        const dataArr = []
        async.eachLimit(rows, constants.ASYNC_LIMIT, (row, cb) => {
          _this._queryForRider(row['user_id']).then(snapshot => {
            if (snapshot.docs.length) {
              const loc = snapshot.docs[0].data()
              loc.status = row.status
              loc.name = `${row['first_name']} ${row['last_name']}`
              loc.mobile = row['mobile_no']
              dataArr.push(loc)
            }

            return cb()
          }).catch(err => cb(err))
        }, (err) => {
          if (err) {
            const error = new Error(JSON.stringify(err))
            error.appendDetails("RiderModel", "getLocationOfRidersInOrg");
            return reject(error);
          }

          return resolve({
            status: 200,
            data: dataArr
          })
        })
      }).catch(reject)
    })
  }

  getAllOrdersAssignedToRiderPartner(orgId) {
    return new Promise((resolve, reject) => {
      if (!orgId) {
        let err = new Error("Invalid rider partner");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "getAllOrdersAssignedToRiderPartner");
        return reject(err);
      }

      RiderDao.getAllOrdersAssignedToRiderPartner(orgId).then(rows => {
        const arr = []

        rows.forEach(row => arr.push(_this._buildOrderForRiderManager(row)))

        return resolve({
          status: 200,
          data: arr
        })
      }).catch(reject)
    })
  }

  _buildOrderForRiderManager(order) {
    const newOrder = {}

    newOrder['orderId'] = order['id'];
    newOrder['deliveryAddress'] = order['order_address'];
    newOrder['customerId'] = order['customer'];
    newOrder['orderDate'] = order['order_date'];
    newOrder['status'] = order['status'];
    newOrder['orgId'] = order['org_id'];
    newOrder['branchId'] = order['branch_id'];
    newOrder['orgName'] = order['org_name'];
    newOrder['branchName'] = order['branch_name'];
    newOrder['latitude'] = order['lat'];
    newOrder['longitude'] = order['long'];
    newOrder['bLatitude'] = order['b_latitude'];
    newOrder['bLongitude'] = order['b_longtude'];
    newOrder['deliveryDate'] = order['delivery_date'];
    newOrder['deliveryETA'] = order['delivery_eta'];
    newOrder['qrImageId'] = order['qr'];
    newOrder['riderViewed'] = order['rider_viewed'];
    newOrder['cusName'] = order['cus_name'];
    newOrder['riderName'] = order['rider_name'];
    newOrder['cusMobile'] = order['cus_mobile'];
    newOrder['riderMobile'] = order['rider_mobile'];
    newOrder['riderPicked'] = order['rider_picked'];
    newOrder['customerPicked'] = order['customer_picked'];
    newOrder['riderStatus'] = order['rider_status'];

    return newOrder;
  }

  assignRider(reqUser, {orderId, riderId}) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        let err = new Error("Empty order id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "assignRider");
        return reject(err);
      }

      if (!riderId) {
        let err = new Error("Empty rider id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "assignRider");
        return reject(err);
      }

      PermissionDao.isUserHavePermission(reqUser['user_id'], constants.PERMISSIONS.ASSIGN_RIDERS_TO_ORDERS).then(has => {
        if (!has) {
          let err = new Error("This user does not has enough permission to carry out this operation");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "assignRider");
          return reject(err);
        }

        RiderDao.getRiderForAdmin(riderId).then(rows => {
          if (!rows || !rows.length) {
            let err = new Error("Invalid rider");
            err.customMessage = err.message;
            err.appendDetails("RiderModel", "assignRider");
            return reject(err);
          }

          if (rows[0]['org_id'] !== reqUser['org_id']) {
            let err = new Error("Rider does not belong to your organization");
            err.customMessage = err.message;
            err.appendDetails("RiderModel", "assignRider");
            return reject(err);
          }

          OrderDao.getOrderById(orderId).then(rows => {
            if (!rows || !rows.length) {
              let err = new Error("Invalid order");
              err.customMessage = err.message;
              err.appendDetails("RiderModel", "assignRider");
              return reject(err);
            }

            if(rows[0]['rider']) {
              let err = new Error("Order already has a rider assigned. Refresh order list");
              err.customMessage = err.message;
              err.appendDetails("RiderModel", "assignRider");
              return reject(err);
            }

            OrderDao.assignRiderManually(riderId, orderId).then(() => {
              OrderModel._changeRiderStatusForOrderAssign(riderId).then(() => resolve({
                status: 200
              })).catch(reject)
            }).catch(reject)
          }).catch(reject)
        }).catch(reject)
      }).catch(reject)
    })
  }

  getAllUnassignedOrders() {
    return new Promise((resolve, reject) => {
      OrderDao.getOrdersInStatusArr([constants.ORDER_STATUS.ACCEPTED, constants.ORDER_STATUS.READY_TO_PICKUP]).then(
        rows => {
          const data = []

          rows.forEach((row) => data.push(_this._buildOrderForRiderManager(row)))

          return resolve({
            status: 200,
            data: data
          })
        }
      ).catch(reject)
    })
  }

  allOrdersForRider(riderId, reqUser) {
    return new Promise((resolve, reject) => {
      if (!riderId) {
        let err = new Error("Empty rider id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "allOrdersForRider");
        return reject(err);
      }

      SysUserProfileDao.getUserByEmailOrUserId(riderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid rider id");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "allOrdersForRider");
          return reject(err);
        }

        const rider = rows[0]

        if (rider['org_id'] !== reqUser['org_id']) {
          let err = new Error("Invalid operation, can not view orders of a rider work for different organization");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "allOrdersForRider");
          return reject(err);
        }

        const statusArr = [constants.ORDER_STATUS.ACCEPTED, constants.ORDER_STATUS.READY_TO_PICKUP,
          constants.ORDER_STATUS.DISPATCHED, constants.ORDER_STATUS.DELIVERED]

        OrderDao.getOrdersAndCustomerByRiderIdAndStatus(riderId, statusArr).then((rows)=> {
          const data = []
          rows.forEach((row) => data.push(_this._buildOrderForRider(row)))

          return resolve({
            status: 200,
            data: data
          })
        }).catch(reject);
      }).catch(reject)
    })
  }

  getNearByRidersForOrder(orderId, adminUser) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        let err = new Error("Empty order id");
        err.customMessage = err.message;
        err.appendDetails("RiderModel", "getNearByRidersForOrder");
        return reject(err);
      }

      OrderDao.getOrderById(orderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error("Invalid order id");
          err.customMessage = err.message;
          err.appendDetails("RiderModel", "getNearByRidersForOrder");
          return reject(err);
        }

        const order = rows[0]
        const storeLocation = {latitude: order['branch_lat'], longitude: order['branch_long']}

        const riderArr = []

        FireStoreService.queryCollection(constants.LIVE_LOCATION_COLLECTION, {
          key: constants.LIVE_LOCATION_ATTRIBUTES.TIME,
          value: (Date.now() - constants.RIDER_LIVE_LOCATION_ONLINE_TIME_GAP),
          operator: constants.FIRE_QUERY_OPERATORS.GEQ
        }).then((snapshot) => {

          async.eachLimit(snapshot.docs, constants.ASYNC_LIMIT, (doc, cb) => {
            const data = doc.data()

            const riderLocation = {
              latitude: data[constants.LIVE_LOCATION_ATTRIBUTES.LOCATION][constants.LIVE_LOCATION_ATTRIBUTES.LOCATION_LAT],
              longitude: data[constants.LIVE_LOCATION_ATTRIBUTES.LOCATION][constants.LIVE_LOCATION_ATTRIBUTES.LOCATION_LANG]
            }

            if (!geoLib.isPointInCircle(riderLocation, storeLocation, constants.RIDER_SELECTION_DISTANCE.KM10)) return cb()

            const riderId = data[constants.LIVE_LOCATION_ATTRIBUTES.RIDER_ID]

            RiderDao.getRiderForAdmin(riderId).then(rows => {
              if (!rows || !rows.length) {
                logger.warn('logName=invalidRiderId, riderId=%s', riderId)
                return cb()
              }

              const rider = rows[0]

              if(rider['status'] === constants.RIDER_STATUS.OFFLINE) {
                logger.warn('logName=riderOffline, riderId=%s', riderId)
                return cb()
              }

              if (rider['org_id'] !== adminUser['org_id']) {
                logger.warn('logName=riderIsNotWorkInSameCompanyAsAdmin, riderId=%s', riderId)
                return cb()
              }

              OrderDao.getOrdersByRiderAndStatus(riderId, [
                constants.ORDER_STATUS.ACCEPTED,
                constants.ORDER_STATUS.READY_TO_PICKUP,
                constants.ORDER_STATUS.DISPATCHED
              ]).then(rows => {
                if (!rows || rows.length > constants.MAX_ORDERS_PER_RIDER) {
                  logger.warn('logName=riderHasMoreThanTwoActiveOrders, riderId=%s', riderId)
                  return cb()
                }

                riderArr.push({
                  userId: rider['user_id'],
                  firstName: rider['first_name'],
                  lastName: rider['last_name'],
                  mobileNumber: rider['mobile_no'],
                  vehicalNo: rider['vehicle_no'],
                  status: rider['status'],
                  orgId: rider['org_id'],
                  currentLocation: riderLocation,
                  distanceToOrderPickup: geoLib.getDistance(riderLocation, storeLocation)
                })

                return cb()
              }).catch(err => {
                if (err) logger.error('logName=errorReadingOrdersBelongToRider, riderId=%s err=%s', riderId, JSON.stringify(err))
                return cb()
              })
            }).catch(err => {
              if (err) logger.error('logName=errorReadingRiderInfo, riderId=%s err=%s', riderId, JSON.stringify(err))
              return cb()
            })
          }, err => {
            if (err) {
              err.appendDetails("RiderModel", "getNearByRidersForOrder")
              return reject(err)
            }

            return resolve({
              status: 200,
              data: riderArr
            })
          })
        }).catch(reject)
      }).catch(reject)
    })
  }
}

export default new RiderModel();
