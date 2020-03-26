import Decorator from '../../helpers/decorator';

import OrderStockDaoDao from '../../databases/mysql/report/orderStockDao';

/**
 * OrderStockDao Model
 */
class OrderStockDaoModel extends Decorator {

  constructor () {
    super();
  }

  getOrderTotal(status, fromDate, toDate, orgId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }

      OrderStockDaoDao.getOrderTotal(status, fromDate, toDate, orgId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  getStoreOrderTotal(status, fromDate, toDate, branchId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderTotal");
        return reject(err);
      }
      OrderStockDaoDao.getStoreOrderTotal(status, fromDate, toDate, branchId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  getItemCount(status, fromDate, toDate, orgId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      OrderStockDaoDao.getItemTotal(status, fromDate, toDate, orgId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  getStoreItemCount(status, fromDate, toDate, branchId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getItemCount");
        return reject(err);
      }

      OrderStockDaoDao.getStoreItemTotal(status, fromDate, toDate, branchId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  getOrderStatus(status, fromDate, toDate, orgId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      OrderStockDaoDao.getOrderStatus(status, fromDate, toDate, orgId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  getStoreOrderStatus(status, fromDate, toDate, branchId) {
    return new Promise((resolve, reject)=>{
      if (!status) {
        let err = new Error("Input Status Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      if (!fromDate) {
        let err = new Error("From Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      if (!toDate) {
        let err = new Error("To Date Not Found");
        err.customMessage = err.message;
        err.appendDetails("OrderStockDao Model", "getOrderStatus");
        return reject(err);
      }

      OrderStockDaoDao.getStoreOrderStatus(status, fromDate, toDate, branchId).then((rows) => resolve({
        status: 200,
        orders: this._buildOrderStockDao(rows)
      })).catch(reject);
    })
  }

  _buildOrderStockDao(dbArray) {
    let list = [];
    if(dbArray.length > 0 && dbArray[0].count > 0) {
      for(let dbObject of dbArray){
        let OrderStockDao = {
          orderAddress: dbObject.order_address,
          orderDate: dbObject.order_date,
          status: dbObject.status,
          orgId: dbObject.org_id,
          orgName: dbObject.name,
          orderId: dbObject.order_id,
          branchStockId: dbObject.branch_stock_id,
          productName: dbObject.product_name,
          quantity: dbObject.quantity,
          unitPrice: dbObject.unit_price,
          total: dbObject.total,
          paymentPercentage: dbObject.payment_percentage,
          branchId: dbObject.branch_id,
          branchName: dbObject.branch_name,
          totalPrice: dbObject.total_price,
          payment_percentage: dbObject.paymentPercentage
        };
        list.push(OrderStockDao);
      }
    }        
    return list;
  }

}

export default new OrderStockDaoModel();
