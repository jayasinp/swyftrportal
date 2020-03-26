import * as query from './orderStock.query';
import executor from '../executor';

/**
 * OrderOrganizationStock Dao
 */
export default class OrderOrganizationStockDao {

    static getOrderTotal(status, fromDate, toDate, orgId) {
        let baseQuery = query.GET_ORDER_TOTAL_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);

        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(orgId) {
            baseQuery += " AND org_id = ?";
            args.push(orgId);
        }
        baseQuery += " group by org_id";
        return executor.execute(baseQuery, [...args]);
    }

    static getStoreOrderTotal(status, fromDate, toDate, branchId) {
        /*if(status !== "ANY")
            return executor.execute(query.GET_STORE_ORDER_TOTAL, [status, fromDate, toDate]);
        else
            return executor.execute(query.GET_STORE_ORDER_TOTAL_ALL_STATUS, [fromDate, toDate]);*/
        let baseQuery = query.GET_ORDER_TOTAL_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);

        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(branchId) {
            baseQuery += " AND branch_id = ?";
            args.push(branchId);
        }
        baseQuery += " group by branch_id";
        return executor.execute(baseQuery, [...args]);
    }

    static getItemTotal(status, fromDate, toDate, orgId) {
        /*if(status !== "ANY")
            return executor.execute(query.GET_ORDER_ITEM_COUNT, [status, fromDate, toDate]);
        else
            return executor.execute(query.GET_ORDER_ITEM_COUNT_ALL_STATUS, [fromDate, toDate]);*/

        let baseQuery = query.GET_ORDER_ITEM_COUNT_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);

        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(orgId) {
            baseQuery += " AND org_id = ?";
            args.push(orgId);
        }
        baseQuery += " group by org_id, branch_stock_id";
        return executor.execute(baseQuery, [...args]);

    }

    static getStoreItemTotal(status, fromDate, toDate, branchId) {
        /*if(status !== "ANY")
            return executor.execute(query.GET_STORE_ORDER_ITEM_COUNT, [status, fromDate, toDate]);
        else
            return executor.execute(query.GET_STORE_ORDER_ITEM_COUNT_ALL_STATUS, [fromDate, toDate]);*/

        let baseQuery = query.GET_ORDER_ITEM_COUNT_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);

        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(branchId) {
            baseQuery += " AND branch_id = ?";
            args.push(branchId);
        }
        baseQuery += " group by branch_id, branch_stock_id";
        return executor.execute(baseQuery, [...args]);
    }

    static getOrderStatus(status, fromDate, toDate, orgId) {
        /*if(status !== "ANY")
            return executor.execute(query.GET_ORDERS_BY_STATUS, [status, fromDate, toDate]);
        else
            return executor.execute(query.GET_ORDERS_BY_STATUS_ALL_STATUS, [fromDate, toDate]);*/

        let baseQuery = query.GET_ORDERS_BY_STATUS_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);

        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(orgId) {
            baseQuery += " AND org_id = ?";
            args.push(orgId);
        }
        baseQuery += " group by org_id";
        return executor.execute(baseQuery, [...args]);
    }

    static getStoreOrderStatus(status, fromDate, toDate, branchId) {
        /*if(status !== "ANY")
            return executor.execute(query.GET_STORE_ORDERS_BY_STATUS, [status, fromDate, toDate]);
        else
            return executor.execute(query.GET_STORE_ORDERS_BY_STATUS_ALL_STATUS, [fromDate, toDate]);*/

        let baseQuery = query.GET_ORDERS_BY_STATUS_ALL_STATUS;
        let args = [];
        args.push(fromDate);
        args.push(toDate);
        
        if(status && status !== "ANY") {
            baseQuery += " AND status = ?";
            args.push(status);
        }
        
        if(branchId) {
            baseQuery += " AND branch_id = ?";
            args.push(branchId);
        }
        baseQuery += " group by branch_id";
        return executor.execute(baseQuery, [...args]);
    }
}