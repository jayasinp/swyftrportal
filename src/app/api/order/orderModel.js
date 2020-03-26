import Decorator from '../../helpers/decorator'
import OrderDao from '../../databases/mysql/order/orderDao'
import ProductDao from '../../databases/mysql/inventory/productDao'
import RiderDao from '../../databases/mysql/rider/riderDao'
import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao'
import PermissionDao from '../../databases/mysql/permission/permissionDao';
import OrderFriendReceiveDao from '../../databases/mysql/orderFriendReceive/orderFriendReceiveDao';
import SystemAssestDao from '../../databases/mysql/systemAssest/systemAssestDao';
import * as Constants from '../../helpers/constants';
import OrderFriendReceiveModel from '../orderFriendReceive/orderFriendReceiveModel';
import FireBaseService from '../../services/firebase/fireBaseServices';
import FireStoreService from '../../services/firestore/fireStoreServices';
import SmsService from '../../services/sms/smsService';
import logger from '../../../utils/logger';
import fileUtils from '../../../utils/fileUtils';
import ProfileDao from '../../databases/mysql/profile/profileDao';
import QR from 'qr-image';
import uuidv1 from 'uuid/v1';
import crypto from 'crypto';
import geoLib from 'geolib';
import * as async from 'async';
import * as _ from 'underscore';
import {generateFromTemplateBill, orderStatusChange} from '../../helpers/emailUtils';
import {getHost} from '../../helpers/utility';
import EmailClient from '../../../utils/emailClient';

import fs from 'fs';

let _this;
/**
 * Order Model
 */
class OrderModel extends Decorator {

  constructor () {
    super()
    _this = this;
  }

  createOrder (order) {
    return new Promise((resolve, reject) => {
      if (!order.orderAddress) {
        let err = new Error('Empty Order Address')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.customer) {
        let err = new Error('Empty Customer')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.orgId) {
        let err = new Error('Empty Organization')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.branchId) {
        let err = new Error('Empty Branch')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.deliveryContactNumber) {
        let err = new Error('Empty Delivery Contact Number')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.paymentStatus) {
        let err = new Error('Payment Status is required')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.latitude || !order.longitude) {
        let err = new Error('Missing order address geo locations')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (order.items.length == 0) {
        let err = new Error('Empty Order')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'createOrder')
        return reject(err)
      }

      if (!order.deliveryCost) {
        order.deliveryCost = 0;
      }

      return this.quantityCheck(order.items).then(() => {
        // Update Order If orderId present
        if (order.orderId) {
          this.isOrderInInitialState(order.orderId).then((res) => {

            if (res.status !== Constants.SUCCESS) {
              let err = new Error('Cant update order not in INIT status');
              err.customMessage = err.message
              err.appendDetails('OrderModel', 'createOrder')
              return reject(err);
            }

            OrderDao.updateOrder(order).then(() => {
              OrderDao.deleteOrderItems(order.orderId).then(() => {
                let orderItems = [];
                let friendReceiveId = null;
                order.items.forEach((item) => {
                  orderItems.push([order.orderId, item.branchStockId, item.quantity]);
                });

                OrderDao.insertItems(orderItems).then(() => {
                  OrderFriendReceiveDao.deleteByOrderId(order.orderId).then(()=>{
                    if(order.friendReceive) {
                      OrderFriendReceiveModel.createOrderFriendReceive(order.friendReceive, order.orderId).then((userDetails) => {
                        if(userDetails.status === Constants.SUCCESS) {
                          friendReceiveId = userDetails.userId
                        }

                        return resolve({
                          status: 200,
                          friendReceiveId: friendReceiveId
                        })
                      }).catch(reject);
                    }

                    _this.sendOrderEmail(parseInt(order.orderId)).then(data => {
                      logger.info('logName=emailSent, msg=%s', JSON.stringify(data))
                      
                      return resolve({
                        status: 200
                      })
                    }).catch(err => {
                      logger.error('logName=errorSendOrderEmail, err=%s', JSON.stringify(err))
                      return reject(err);
                    })

                  }).catch(reject);
                }).catch(reject);
              }).catch(reject)
            }).catch(reject);
          }).catch(reject);
        } else {
          OrderDao.insertOrder(order).then((result) => {
 console.log("__________________result___________________________")
            console.log(result)


            let orderId = result['insertId'];
            let orderItems = [];
            let qrSalt = uuidv1();
console.log("__________________qrSalt ___________________________")
            console.log(qrSalt )



            let hash = crypto.createHmac('sha256', qrSalt);
console.log("__________________hash ___________________________")
            console.log(hash )

            hash.update(qrSalt);
 //var img = QR.image(qrSalt );

 console.log("__________________qr_svg img ___________________________")
        //    console.log(img )

            let qr_svg = QR.imageSync(hash.digest("hex").toString()+orderId, { type: 'png' });
//let qr_svg = QR.image(hash.digest("hex").toString()+orderId, { type: 'png' });
 console.log("__________________qr_svg___________________________")
            console.log(qr_svg)
            let buf = Buffer.from(qr_svg, "base64");


//var imageBuffer = request.file.buffer;
            var imageName = (null, './public/src/uploads/'+`${orderId}.png`);
            fs.createWriteStream(imageName).write(buf);

            console.log("_________________buf__________________________")
            console.log(buf)
 console.log("_________________fs__________________________")
            console.log(fs)





            SystemAssestDao.saveFileToDB(`${orderId}.png`, orderId, null, 'image/png', 'QR', buf).then((fileResult) => {
              OrderDao.updateOrderQR(fileResult['insertId'], qrSalt, orderId).then(()=>{

              }).catch(reject);
            }).catch(reject);

            order.items.forEach((item) => {
              orderItems.push([orderId, item.branchStockId, item.quantity]);
            });

            OrderDao.insertItems(orderItems).then(() => {
              let friendReceiveId = null;

              if(order.friendReceive) {
                OrderFriendReceiveModel.createOrderFriendReceive(order.friendReceive, orderId).then((userDetails) => {
                  if(userDetails.status === Constants.SUCCESS) {
                    friendReceiveId = userDetails.userId
                  }
                  _this.sendOrderEmail(parseInt(orderId)).then((data) => {
                    logger.info('logName=emailSent, msg=%s', JSON.stringify(data))
                    
                    return resolve({
                      status: Constants.SUCCESS,
                      orderId: orderId,
                      friendReceiveId: friendReceiveId
                    });
                }).catch(err => logger.error('logName=errorSendOrderEmail, err=%s', JSON.stringify(err)))
                }).catch(reject);
              } else {
                _this.sendOrderEmail(parseInt(orderId)).then((data) => {
                  logger.info('logName=emailSent, msg=%s', JSON.stringify(data))
                     
                  return resolve({
                  status: Constants.SUCCESS,
                    orderId: orderId,
                  });
              }).catch(err =>{
           logger.error('logName=errorSendOrderEmail, err=%s', JSON.stringify(err))
                  return reject(err);
                })
              }
              
            }).catch(reject)
          }).catch(reject)
        }
      }).catch(reject);
    });
  }

  sendOrderEmail(orderId) {
    return new Promise((resolve, reject) => {
      OrderDao.getOrderInfoForEmail(orderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error('Invalid Order');
          err.customMessage = err.message;
          err.appendDetails('OrderModel', 'sendOrderEmail');
          return reject(err);
        }

        const order = rows[0];

        OrderDao.getOrderItemsForEmail(orderId).then(rows => {

          const emailHtml = generateFromTemplateBill(getHost(), order['arrive_time'], orderId,
            order['from_address'], order['to_address'], rows, order['delivery_cost'])

          EmailClient.sendEmail({
            to: order['email'],
            from: '',
            subject: `Swyftr Order #${orderId}`,
            html: emailHtml
          }).then(resolve).
          catch(reject);
        }).catch(reject)
      }).catch(reject);
    })
  }

  quantityCheck(orderItems) {
    return new Promise((resolve, reject) => {
      let itemIds = [];
      for (let item of orderItems) {
        itemIds.push(item.branchStockId);
      }
      ProductDao.getProductsByIds(itemIds).then((itemResult) => {
        for(let element of itemResult){
          for (let item of orderItems) {
            if(element.id === item.branchStockId && element.qty - item.quantity < 0) {
              let err = new Error('Not enough item quantity');
              err.customMessage = err.message;
              err.appendDetails('OrderModel', 'createOrder');
              return reject(err);
            }
          }
        }
        return resolve();
      }).catch(reject);
    });
  }

  getOrderByCustomer (customerId, reqUser) {
    return new Promise((resolve, reject) => {
      if (!customerId || isNaN(customerId)) {
        let err = new Error('Empty Customer ID')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderByCustomer')
        return reject(err)
      }

      if (reqUser['user_id'] !== parseInt(customerId)) {
        let err = new Error('Unauthorized action, can not retrieve other customer orders')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderByCustomer')
        return reject(err)
      }

      return OrderDao.getOrderByCustomer(customerId).then((result) => {
        this.getResult(result).then((orderObj) => {
          resolve(orderObj);
        }).catch(reject);
      }).catch(reject)
    })
  }

  getOrderById (id, customerId) {
    return new Promise((resolve, reject) => {
      if (!id) {
        let err = new Error('Empty Order ID')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderById')
        return reject(err)
      }      
      return OrderDao.getOrderById(id, customerId).then((result) => {
        this.getResult(result).then((orderObj) => {
          if(orderObj.status !== Constants.NOT_FOUND)
            orderObj.orders = orderObj.orders[0];
          resolve(orderObj);
        }).catch(reject);        
      }).catch(reject)
    })
  }

  cancelOrder (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        let err = new Error('Empty Order ID')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderById')
        return reject(err)
      }

      return OrderDao.getOrderById(id).then(() => {
        this.isOrderInInitialState(id).then((res) => {
          if (res.status == Constants.SUCCESS) {
            return OrderDao.deleteOrderItems(id).then(() => OrderDao.deleteOrder(id).then(() => resolve({
              status: Constants.SUCCESS
            })).catch(reject)).catch(reject)
          } else {
            return resolve(res)
          }
        }).catch(reject)
      }).catch(reject)
    })
  }

  isOrderInInitialState (orderId) {
    return OrderDao.getOrderById(orderId).then((result) => {
      if (result.length != 1) {
        return {status: Constants.NOT_FOUND}
      } else if (result[0].status != 'INIT') {
        return {status: Constants.BAD_REQUEST}
      } else {
        return {status: Constants.SUCCESS}
      }
    })

  }

  getResult(result) {
    return new Promise((resolve, reject) => {
      if (result.length == 0) {
        resolve ({
          status: Constants.NOT_FOUND
        });
      } else {
        let promises = [];

        result.forEach((element) => {
          promises.push(new Promise((resolve, reject) => {
            this.getOrderFriendDetails(element.id).then((friendDetails) => {
              const order = this._buildOrderCustomer(element, friendDetails["orderFriend"]);

              OrderDao.getOrderItems(element.id).then((rows) => {
                const items = [];
                let total = 0;
                rows.forEach((row) => {
                  const item = this._buildOrderItems(row);
                  total += item.quantity * item.unitPrice;
                  items.push(item);
                });

                order['items'] = items;
                order['total'] = total;

                return resolve(order)
              }).catch(reject);
            }).catch(reject);
          }))
        })

        return Promise.all(promises).then((orders) => resolve ({
            status: Constants.SUCCESS,
            orders: orders
          })).catch(reject);
      }
    });    
  }

  getOrderFriendDetails(orderId){
    return OrderFriendReceiveModel.getOrderFriendDetailsByOrderId(orderId).then((result) => result);
  }

  _buildOrder(order) {
    const newOrder = {};

    newOrder['orderId'] = order['id'];
    newOrder['deliveryAddress'] = order['order_address'];
    newOrder['customerId'] = order['customer'];
    newOrder['deliveryRequired'] = order['delivery_required'];
    newOrder['riderId'] = order['rider'];
    newOrder['orderDate'] = order['order_date'];
    newOrder['status'] = order['status'];
    newOrder['orgId'] = order['org_id'];
    newOrder['branchId'] = order['branch_id'];
    newOrder['cusName'] = order['cus_name'];
    newOrder['orgName'] = order['org_name'];
    newOrder['branchName'] = order['branch_name'];
    newOrder['riderName'] = order['rider_name'];
    newOrder['latitude'] = order['lat'];
    newOrder['longitude'] = order['long'];
    newOrder['bLatitude'] = order['b_latitude'];
    newOrder['bLongitude'] = order['b_longtude'];
    newOrder['deliveryDate'] = order['delivery_date'];
    newOrder['deliveryETA'] = order['delivery_eta'];
    newOrder['deliveryCost'] = order['delivery_cost'];
    newOrder['deliveryContactNumber'] = order['delivery_contact_number'];
    newOrder['writtenAddress'] = order['written_address'];
    newOrder['qrImageId'] = order['qr'];
    newOrder['paymentStatus'] = order['payment_status'];

    if (order['products']){
      newOrder['products'] = order['products'].split(',');
    }

    return newOrder;
  }

  _buildOrderCustomer(order, orderFriend) {
    const newOrder = {};
    newOrder['orderId'] = order['id'];
    newOrder['orderAddress'] = order['order_address'];
    newOrder['customer'] = order['customer'];
    newOrder['deliveryRequired'] = order['delivery_required'];
    newOrder['riderId'] = order['rider'];
    newOrder['orderDate'] = order['order_date'];
    newOrder['status'] = order['status'];
    newOrder['orgId'] = order['org_id'];
    newOrder['branchId'] = order['branch_id'];
    newOrder['cusName'] = order['cus_name'];
    newOrder['orgName'] = order['org_name'];
    newOrder['branchName'] = order['branch_name'];
    newOrder['riderName'] = order['rider_name'];
    newOrder['latitude'] = order['lat'];
    newOrder['longitude'] = order['long'];
    newOrder['deliveryDate'] = order['delivery_date'];
    newOrder['deliveryETA'] = order['delivery_eta'];
    newOrder['orderFriend'] = orderFriend;
    newOrder['deliveryCost'] = order['delivery_cost'];
    newOrder['deliveryContactNumber'] = order['delivery_contact_number'];
    newOrder['writtenAddress'] = order['written_address'];
    newOrder['paymentStatus'] = order['payment_status'];
    newOrder['qr'] = fileUtils.convertBlobToBase64(order['qr']);
    return newOrder;
  }

  _buildOrderCustomerForSystemDashBoard(row) {
    const customer = {
      firstName: row['first_name'],
      lastName: row['last_name'],
      email: row['email'],
      mobileNo: row['mobile_no'],
      phoneNo: row['phone_no'],
      address: row['order_address'],
    }

    return customer;
  }


  _buildOrderItems(item) {
    const newItem = {};

    newItem['orderId'] = item['order_id'];
    newItem['branchStockId'] = item['branch_stock_id'];
    newItem['quantity'] = item['quantity'];
    newItem['unitPrice'] = item['unit_price'];
    newItem['productName'] = item['product_name'];
    return newItem;
  }

  getAllOrdersByUserOrg (userEmail, status) {
    return new Promise((resolve, reject) => {
      if (!userEmail) {
        let err = new Error('Invalid user name')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getAllOrdersByUserOrg')
        return reject(err)
      }

      SysUserProfileDao.getUserByEmailOrUserId(null, userEmail).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error('User does not exists')
          err.customMessage = err.message
          err.appendDetails('OrderModel', 'getAllOrdersByUserOrg')
          return reject(err)
        }

        const userProfile = rows[0];

        PermissionDao.getUserPermissions(userProfile['user_id']).then((permissions)=> {
          if (!permissions || (!permissions[Constants.PERMISSIONS.SWYFTR_SUPER_USER]
            && !permissions[Constants.PERMISSIONS.MANAGE_ORDERS])) {
            let err = new Error('User does not have enough permissions to execute this task')
            err.customMessage = err.message
            err.appendDetails('OrderModel', 'getAllOrdersByUserOrg')
            return reject(err)
          }

          let orgId = null;
          let branchId = null;

          if (userProfile['user_type'] !== Constants.USER_TYPE.SWYFTR && userProfile['org_id'] !== Constants.SWYFTER_ORG_ID ) {
            orgId = userProfile['org_id'];
            branchId = userProfile['org_branch']
          }

          OrderDao.getAllOrders(orgId, branchId, status).then((result)=> {
            const orderList = [];
            result.forEach((order)=> orderList.push(_this._buildOrder(order)));

            return resolve({
              status: 200,
              data: orderList
            })
          }).catch(reject)
        }).catch(reject)
      }).catch(reject);
    })
  }

  getOrderInfo(orderId) {
    return new Promise((resolve, reject)=> {
      if (!orderId) {
        let err = new Error('Invalid order id')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderInfo')
        return reject(err)
      }
console.log("OrderDao.orderId2020 ")
console.log(orderId)

      OrderDao.getOrderInfoForAdminById(orderId).then((rows) => {
console.log("OrderDao.getOrderInfoForAdminById 2020 ")
console.log(rows)
        if (!rows.length) {
          let err = new Error('Order not found')
          err.customMessage = err.message
          err.appendDetails('OrderModel', 'getOrderInfo')
          return reject(err)
        }

        const orderItems = [];
        rows.forEach((row) => orderItems.push(_this._buildOrderItem(row)));

        OrderDao.getOrderCustomerDetailsByOrderId(orderId).then((rows)=> {
          if (!rows.length) {
            let err = new Error('Customer not found')
            err.customMessage = err.message
            err.appendDetails('OrderModel', 'getOrderInfo')
            return reject(err)
          }

          const customer = rows[0]

          RiderDao.getRiderInfoForCustomer(orderId).then(rows => {
            let rider = null

            if (rows && rows.length) {
              rider = _this._buildRiderForCustomer(rows[0])
            }

            return resolve({
              status: 200,
              data: {
                items: orderItems,
                customer: _this._buildOrderCustomerForSystemDashBoard(customer),
                rider: rider
              }
            });
          }).catch(reject)
        }).catch(reject);
      }).catch(reject);
    });
  }

  changeOrderStatusByQRByRider (qrString, status) {
    return new Promise((resolve, reject) => {
      this.validateQR(qrString).then((orderId) => {
        OrderDao.getOrderById(orderId).then((orderResult) => {

          if (orderResult[0].rider_picked === 0) {
            this.changeOrderStatus(orderId, status).then((result) => {
              OrderDao.updateOrderRiderPickedStatus(orderId, 1).then(() => {
                _this._changeRiderStatusForOrderAssign(orderResult[0]['rider'], Constants.RIDER_STATUS.ON_DELIVERY).then(
                  () => resolve(result)
                ).catch(reject)
              }).catch(reject)
            }).catch(reject)
          } else {
            let err = new Error('Rider Already Picked')
            err.customMessage = err.message
            err.appendDetails('OrderModel', 'changeOrderStatusByQR')
            return reject(err)
          }
        }).catch(reject)
      }).catch(reject)
    })
  }

  changeOrderStatusByQRByCustomer (qrString, status) {
    return new Promise((resolve, reject) => {
      this.validateQR(qrString).then((orderId) => {
        OrderDao.getOrderById(orderId).then((orderResult) => {

          if (orderResult[0].customer_picked === 0) {
            this.changeOrderStatus(orderId, status).then((result) => {
              OrderDao.updateOrderCustomerPickedStatus(orderId, 1).then(() => {
                _this._changeRiderStatusForOrderAssign(orderResult[0]['rider']).then(() => resolve(result))
                  .catch(reject)
              }).catch(reject)
            }).catch(reject)
          } else {
            let err = new Error('Customer Already Picked')
            err.customMessage = err.message
            err.appendDetails('OrderModel', 'changeOrderStatusByQRByCustomer')
            return reject(err)
          }
        }).catch(reject)
      }).catch(reject)
    })
  }

  changeOrderStatusAfterFriendReceive (orderId, status) {
    return new Promise((resolve, reject) => {
        OrderDao.getOrderById(orderId).then((orderResult) => {

          if (orderResult[0].customer_picked === 0) {
            this.changeOrderStatus(orderId, status).then((result) => {
              OrderDao.updateOrderCustomerPickedStatus(orderId, 1).then(() => {
                _this._changeRiderStatusForOrderAssign(orderResult[0]['rider']).then(() => resolve(result))
                  .catch(reject)
              }).catch(reject)
            }).catch(reject)
          } else {
            let err = new Error('Customer Already Picked')
            err.customMessage = err.message
            err.appendDetails('OrderModel', 'changeOrderStatusByQRByCustomer')
            return reject(err)
          }
        }).catch(reject)
    })
  }

  changeOrderStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        let err = new Error('Invalid order id')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'changeOrderStatus')
        return reject(err)
      }

      if (!Constants.VALID_ORDER_STATUS.indexOf(status) === Constants.NOT_FOUND_INDEX) {
        let err = new Error('Invalid status')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'changeOrderStatus')
        return reject(err)
      }

      OrderDao.getOrderById(orderId).then((rows) => {
        if (!rows.length) {
          let err = new Error('Order not found')
          err.customMessage = err.message
          err.appendDetails('OrderModel', 'changeOrderStatus')
          return reject(err)
        }

        const order = rows[0];

        switch (order['status']) {
          case Constants.ORDER_STATUS.NEW:

            if ([Constants.ORDER_STATUS.ACCEPTED, Constants.ORDER_STATUS.CANCELED].indexOf(status) === Constants.NOT_FOUND_INDEX) {
              let err = new Error('Invalid status change')
              err.customMessage = err.message
              err.appendDetails('OrderModel', 'changeOrderStatus')
              return reject(err)
            }

            // When updating new order to accepted status we change the status even though rider not allocated
            // because riders may be busy but can be available when order is ready to pickup. If we can not allocate
            // a rider there also, we will need a rider manager to allocate the rider.
            _this._updateChangedOrderStatus(orderId, status, order).then(() => {
              if (status === Constants.ORDER_STATUS.CANCELED || order['rider']) return resolve({status: 200})

              if (order['delivery_date'] - Date.now() > Constants.TIME_GAP_TO_DETERMIN_ORDER_IS_SCHEDULED) return resolve({status: 200})

              _this._selectRider(order).then((row) => {
                if (!row || !row.rider) {
                  let err = new Error('Order status changed but rider can not be allocated since all riders are busy !')
                  err.customMessage = err.message
                  err.statusCode = Constants.ERROR_BUT_CONTINUE
                  err.appendDetails('OrderModel', 'changeOrderStatus')
                  return reject(err)
                }

                return OrderDao.updateRiderForOrder(orderId, row.rider).
                then(() => _this._changeRiderStatusForOrderAssign(row.rider).then(resolve)
                  .catch(reject)
                ).catch(reject)
              }).catch(reject)
            }).catch(reject)

            break;

          case Constants.ORDER_STATUS.ACCEPTED:

            if ([Constants.ORDER_STATUS.READY_TO_PICKUP, Constants.ORDER_STATUS.CANCELED].indexOf(status) === Constants.NOT_FOUND_INDEX) {
              let err = new Error('Invalid status change')
              err.customMessage = err.message
              err.appendDetails('OrderModel', 'changeOrderStatus')
              return reject(err)
            }

            if (status === Constants.ORDER_STATUS.CANCELED || order['rider']) return _this._updateChangedOrderStatus(orderId, status, order).then(resolve).catch(reject)

            _this._selectRider(order).then((row) => {
              if (!row || !row.rider) {
                let err = new Error('Can not change order status to "Ready To Pickup" without selecting rider. All riders are busy at the moment.')
                err.customMessage = err.message
                err.appendDetails('OrderModel', 'changeOrderStatus')
                return reject(err)
              }

              // send sms rider
              OrderDao.updateRiderForOrder(orderId, row.rider).then(
                () => _this._updateChangedOrderStatus(orderId, status, order)
                  .then(() => _this._changeRiderStatusForOrderAssign(row.rider).then(() => resolve({
                    status: 200
                  })).catch(reject))
                  .catch(reject)
              ).catch(reject);
            }).catch(reject)
            break;

          case Constants.ORDER_STATUS.READY_TO_PICKUP:

            if (status !== Constants.ORDER_STATUS.DISPATCHED) {
              let err = new Error('Invalid status change')
              err.customMessage = err.message
              err.appendDetails('OrderModel', 'changeOrderStatus')
              return reject(err)
            }

            _this._updateChangedOrderStatus(orderId, status, order).then(resolve).catch(reject)
            break;

          case Constants.ORDER_STATUS.DISPATCHED:

            if (status !== Constants.ORDER_STATUS.DELIVERED) {
              let err = new Error('Invalid status changeS')
              err.customMessage = err.message
              err.appendDetails('OrderModel', 'changeOrderStatus')
              return reject(err)
            }

            _this._updateChangedOrderStatus(orderId, status, order).then(resolve).catch(reject)
            break;
        }
      }).catch(reject);
    })
  }

  _updateChangedOrderStatus(orderId, status, order) {
    return new Promise((resolve, reject) => {
      OrderDao.updateOrderStatus(orderId, status).then(() => {

        // If order is not canceled we do not need to modify stock details so we return from
        // just updating order status
        if (status !== Constants.ORDER_STATUS.CANCELED) {
          _this._buildAndSendNotification(order['customer'], orderId, status).catch((err) => {
            logger.error('logName=errorSeindingFCM, err=%s', JSON.stringify(err));
          });
          return resolve({
            status : 200
          })
        }

        // When order is canceled we need to add the removed stock back so that quantity statys same before order
        // placed.
        OrderDao.getOrderItems(orderId).then((rows) => {
          const promises = [];
          rows.forEach((row)=> promises.push(OrderDao.reAddOrderStock(row['branch_stock_id'], row['quantity'])));

          Promise.all(promises).then(()=> {
            _this._buildAndSendNotification(order['customer'], orderId, status).catch((err) => {
              logger.error('logName=errorSeindingNotification, err=%s', JSON.stringify(err));
            });

            return resolve({
              status : 200
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    })
  }

  _changeRiderStatusForOrderAssign(riderId, newStatus) {
    return new Promise((resolve, reject) => {
      if (!riderId) {
        let err = new Error('Empty rider id')
        err.customMessage = err.message
        err.appendDetails('OrderModel', '_changeRiderStatusForOrderAssign')
        return reject(err)
      }

      RiderDao.getRiderInfoByUserId(riderId).then(rows => {
        if (!rows || !rows.length) {
          let err = new Error('Invalid rider')
          err.customMessage = err.message
          err.appendDetails('OrderModel', '_changeRiderStatusForOrderAssign')
          return reject(err)
        }

        if (rows[0]['status'] === Constants.RIDER_STATUS.OFFLINE) {
          let err = new Error('Invalid operation, trying to assign order for offline rider')
          err.customMessage = err.message
          err.appendDetails('OrderModel', '_changeRiderStatusForOrderAssign')
          return reject(err)
        }

        if (!newStatus) {
          if (rows[0]['status'] === Constants.RIDER_STATUS.AVAILABLE) {
            return RiderDao.updateRiderStatus(riderId, Constants.RIDER_STATUS.ASSIGNED).then(() => resolve({
              status: 200
            })).catch(reject)
          }

          if (rows[0]['status'] === Constants.RIDER_STATUS.ON_DELIVERY) {
            return OrderDao.getOrdersByRiderAndStatus(riderId, [
              Constants.ORDER_STATUS.ACCEPTED,
              Constants.ORDER_STATUS.READY_TO_PICKUP,
              Constants.ORDER_STATUS.DISPATCHED
            ]).then(rows => {

              if (rows && rows.length > 0) {
                return resolve({status: 200})
              }

              return RiderDao.updateRiderStatus(riderId, Constants.RIDER_STATUS.AVAILABLE).then(
                () => resolve({status: 200})
              ).catch(reject);
            }).catch(reject)
          }

          return resolve({
            status: 200
          })
        } else {
          if (newStatus === Constants.RIDER_STATUS.ON_DELIVERY && rows[0]['status'] === Constants.RIDER_STATUS.DELIVERY_ACCEPTED) {
            return RiderDao.updateRiderStatus(riderId, Constants.RIDER_STATUS.ON_DELIVERY).then(() => resolve({
              status: 200
            })).catch(reject)
          }

          return resolve({
            status: 200
          })
        }
      }).catch(reject)
    })
  }

  _buildAndSendNotification(userId, orderId, status) {
    return new Promise((resolve, reject) => {
      ProfileDao.getUserByEmailOrUserId(userId, null).then((rows)=> {
        if (!rows.length) {
          let err = new Error('Invalid customer profile')
          err.customMessage = err.message
          err.appendDetails('OrderModel', '_buildAndSendNotification')
          return reject(err)
        }

        const user = rows[0];
        const deviceId = user['device_id'];
        let data, notification;

        if (user['device_os'] === 'ios') {
          data = {
            orderId: orderId,
            newStatus: status
          }

          notification = {
            aps: {
              alert: {
                title: `Order is now ${Constants.ORDER_STATUS_DESC[status]}`,
                body: `Status of your order with id '${orderId}' updated to ${Constants.ORDER_STATUS_DESC[status]}`
              },
              category: "CustomPush"
            }
          }
        } else if (user['device_os'] === 'android') {
          data = {
            orderId: orderId,
            newStatus: status
          }

          notification = {
            notification: {
              title: `Order is now ${Constants.ORDER_STATUS_DESC[status]}`,
              body: `Status of your order with id '${orderId}' updated to ${Constants.ORDER_STATUS_DESC[status]}`
            },
            priority: "",
            to: deviceId
          }
        } else {
          let err = new Error('Invalid device os type')
          err.customMessage = err.message
          err.appendDetails('OrderModel', '_buildAndSendNotification')
          return reject(err)
        }
        this._buildAndSendNotificationRider(orderId, status);
        const smsBody = `Dear customer, your order is ${Constants.ORDER_STATUS_DESC[status]}\norder no: ${orderId}`;
        return SmsService.sendSms(user['mobile_no'], smsBody).then(()=> FireBaseService.sendCloudMessageToDevice(deviceId, Constants.NOTIFICATION_COLLAPSE_KEYS.ORDER_STATUS,
            data, notification).
          then((data) => {
            logger.info('logName=fcmResponse, message=%s', JSON.stringify(data));
          }).catch(reject)).catch(reject);
      }).catch(reject);
    })
  }

  _buildAndSendNotificationRider(orderId, status) {
    return new Promise((resolve, reject) => {
      OrderDao.getRiderIdByOrderId(orderId).then((riderRow) => {
        if(riderRow && riderRow.length && riderRow[0].rider) {
          SysUserProfileDao.getUserByEmailOrUserId(riderRow[0].rider, null).then((rows)=> {
            if (!rows.length) {
              let err = new Error('Invalid Rider profile')
              err.customMessage = err.message
              err.appendDetails('OrderModel', '_buildAndSendNotificationRider')
              return reject(err)
            }
            const user = rows[0];
            const smsBody = `Dear rider, order no: ${orderId} is ${Constants.ORDER_STATUS_DESC[status]}`;
            return SmsService.sendSms(user['mobile_no'], smsBody).then( () => {
              EmailClient.sendEmail({
                to: user.email,
                from: '',
                subject: "Order "+ orderId +" status has been changed.",
                html: orderStatusChange(smsBody)
              }).then(()=> resolve({
                status: Constants.SUCCESS
              })).catch(reject);
            }
            ).catch(reject);
          }).catch(reject);
        } else {
          return resolve();
        }
      }).catch(reject);

    })
  }

  _buildOrderItem(row) {
 console.log("_buildOrderItem(row)2020       -------------------------------------------------")
 console.log(row)
    const item = {}
    item['prodId'] = row['prod_id'];
    item['productName'] = row['product_name'];
    item['unitPrice'] = row['unit_price'];
    item['categoryId'] = row['category_id'];
    item['description'] = row['description'];
    item['discount'] = row['discount'];
    item['sftrDiscount'] = row['sftrDiscount'];

    item['availability'] = row['availability'];
    item['quantity'] = row['quantity'];

    if (row['prod_image_id'] && row['prod_image_id'] !== '') {
      item['prodImageId'] = row['prod_image_id'].split('|')[0]
    }

    return item;
  }

  validateQR (qrString) {
    return new Promise((resolve, reject) => {
      if (!qrString) {
        let err = new Error('Empty QR String')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'validateQR')
        return reject(err)
      }

      if (qrString.length < Constants.QR_SALT_LENGTH) {
        let err = new Error('Invalid QR String')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'validateQR')
        return reject(err)
      }

      // let qrSalt = qrString.substr(0,Constants.QR_SALT_LENGTH);
      let orderId = qrString.substring(Constants.QR_SALT_LENGTH, qrString.length);

      return OrderDao.getOrderQRSalt (orderId).then((result) => {
        let hash = crypto.createHmac('sha256', result[0].qr_salt);
        hash.update(result[0].qr_salt);
        let hashString = hash.digest("hex").toString();
        if(hashString+orderId === qrString) {
          resolve(orderId);
        } else {
          let err = new Error('QR Validation Failed')
          err.customMessage = err.message
          err.appendDetails('OrderModel', 'validateQR')
          return reject(err)
        }

      }).catch(reject)
    })
  }

  _selectRider(order) {
    return new Promise((resolve, reject) => {

      const storeLocation = {latitude: order['branch_lat'], longitude: order['branch_long']} // Center
      const clientLocation = {latitude: order['lat'], longitude: order['long']}

      const riderByRadious = {
        five: [],
        eight: [],
        ten: []
      }

      FireStoreService.queryCollection(Constants.LIVE_LOCATION_COLLECTION, {
        key: Constants.LIVE_LOCATION_ATTRIBUTES.TIME,
        value: (Date.now() - Constants.RIDER_LIVE_LOCATION_ONLINE_TIME_GAP),
        operator: Constants.FIRE_QUERY_OPERATORS.GEQ
      }).then((snapshot) => {
        async.eachLimit(snapshot.docs, Constants.ASYNC_LIMIT, (doc, cb) => {
          const data = doc.data()

          const location = {
            latitude: data[Constants.LIVE_LOCATION_ATTRIBUTES.LOCATION][Constants.LIVE_LOCATION_ATTRIBUTES.LOCATION_LAT],
            longitude: data[Constants.LIVE_LOCATION_ATTRIBUTES.LOCATION][Constants.LIVE_LOCATION_ATTRIBUTES.LOCATION_LANG]
          }

          if (_this._isRiderOrLocationWithinRadious(storeLocation, location, Constants.RIDER_SELECTION_DISTANCE.KM5)) {
            return _this._readAndAddRiderInfo(data, riderByRadious.five, storeLocation, location, cb);
          } else if (_this._isRiderOrLocationWithinRadious(storeLocation, location, Constants.RIDER_SELECTION_DISTANCE.KM8)) {
            return _this._readAndAddRiderInfo(data, riderByRadious.eight, storeLocation, location, cb);
          } else if (_this._isRiderOrLocationWithinRadious(storeLocation, location, Constants.RIDER_SELECTION_DISTANCE.KM10)) {
            return _this._readAndAddRiderInfo(data, riderByRadious.ten, storeLocation, location, cb);
          } else {
            return cb()
          }
        }, (err) => {
          if (err) return reject(err)

          let assignedRiderId = null;

          async.eachLimit(Object.keys(riderByRadious), Constants.ASYNC_LIMIT, (key, keyCallback) => {
            if (assignedRiderId) return keyCallback()

            const riderPool = _.sortBy(riderByRadious[key], (item) => item.distance)

            async.eachLimit(riderPool, Constants.ASYNC_LIMIT, (rider, riderCallback) => {
              if(assignedRiderId) return;

              if (['AVAILABLE', 'ON_DELIVERY', 'DELIVERY_ACCEPTED', 'ASSIGNED'].indexOf(rider.status) !== Constants.NOT_FOUND_INDEX) {

                if (rider.status === Constants.RIDER_STATUS.AVAILABLE) {

                  assignedRiderId = rider.riderId
                  return riderCallback()

                } else if (rider.status === Constants.RIDER_STATUS.DELIVERY_ACCEPTED || rider.status === Constants.RIDER_STATUS.ASSIGNED) {

                  return RiderDao.getOnGoingDeliveryLocationsForRider(rider.riderId, Constants.ORDER_STATUS.READY_TO_PICKUP).then((rows) => {

                    if (!rows || !rows.length) return riderCallback();

                    let isRiderElegible = false;

                    rows.forEach((row) => {
                      const orderDeliLoc = {latitude: row['lat'], longitude: row['long']}
                      if (row['branch_id'] === order['branch_id'] &&
                        _this._isRiderOrLocationWithinRadious(clientLocation, orderDeliLoc, Constants.RIDER_SELECTION_DISTANCE.KM5)) {
                        isRiderElegible = true;
                      }
                    })

                    if (isRiderElegible) {
                      assignedRiderId = rider.riderId
                    }

                    return riderCallback();
                  }).catch((err) => riderCallback(err))

                } else if (rider.status === Constants.RIDER_STATUS.ON_DELIVERY) {

                  return RiderDao.getOnGoingDeliveryLocationsForRider(rider.riderId, Constants.ORDER_STATUS.DISPATCHED).then((rows) => {
                    if (!rows || rows.length !== 1) return riderCallback()

                    const delivery = {latitude: rows[0]['lat'], longitude: rows[0]['long']}

                    if (geoLib.getDistance(delivery, storeLocation) < Constants.KM3) {
                      assignedRiderId = rider.riderId
                    }

                    return riderCallback();
                  }).catch((err) => riderCallback(err))

                } else {
                  return riderCallback();
                }
              } else {
                return riderCallback();
              }

            }, keyCallback)
          }, (err) => {
            if (err) return reject(err)

            return resolve({
              rider: assignedRiderId
            })
          })
        })
      }).catch(reject)
    })
  }

  _readAndAddRiderInfo(data, riderGroup, center, location, cb) {
    const riderId = data[Constants.LIVE_LOCATION_ATTRIBUTES.RIDER_ID]
    return RiderDao.getRiderInfoByUserId(riderId).then((rows) => {

      if (!rows || !rows.length) {
        let err = new Error('Invalid rider id retrieved from FIRESTORE, rider_id=' + riderId)
        err.customMessage = err.message
        err.appendDetails('OrderModel', '_selectRider')
        return cb(err)
      }

      const riderInfo = rows[0]

      riderGroup.push({
        riderId: riderInfo['user_id'],
        status: riderInfo['status'],
        distance: geoLib.getDistance(center, location)
      })

      return cb()
    }).catch((err) => cb(err))
  }

  _isRiderOrLocationWithinRadious(center, currentLocation, radious) {
    return geoLib.isPointInCircle(center, currentLocation, radious)
  }

  getOrderRiderInfo(orderId) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        let err = new Error('Invalid order id')
        err.customMessage = err.message
        err.appendDetails('OrderModel', 'getOrderRiderInfo')
        return reject(err)
      }

      RiderDao.getRiderInfoForCustomer(orderId).then((rows) => {
        if (!rows || !rows.length) {
          let err = new Error('Invalid rider info for order id')
          err.customMessage = err.message
          err.appendDetails('OrderModel', 'getOrderRiderInfo')
          return reject(err)
        }

        return resolve({
          rider: _this._buildRiderForCustomer(rows[0]),
          status: 200
        })
      }).catch(reject)
    })
  }

  _buildRiderForCustomer(row) {
    const rider = {}

    rider.firstName = row['first_name']
    rider.lastName = row['last_name']
    rider.mobile = row['mobile_no']
    rider.vehicleNo = row['vehicle_no']
    rider.riderId = row['user_id']

    return rider;
  }
}

export default new OrderModel()
