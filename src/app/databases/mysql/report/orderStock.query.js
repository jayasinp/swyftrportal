export const GET_ORDER_TOTAL_ALL_STATUS = "select org_id, name, payment_percentage, SUM(quantity * unit_price) as total, branch_id, name, branch_name, "+
    "count(*) as count from ORDER_STORE_STOCK_VIEW" +
    " where order_date > ? and order_date < ?";

export const GET_ORDER_ITEM_COUNT_ALL_STATUS = "select org_id, name, "+
    "branch_stock_id, SUM(quantity) as total, "+
    "branch_id, branch_name, SUM(unit_price) as total_price, payment_percentage, "+
    "count(*) as count, product_name from ORDER_STORE_STOCK_VIEW "+
    "where order_date > ? and order_date < ?";

export const GET_ORDERS_BY_STATUS_ALL_STATUS = "select org_id, name, "+
    "count(order_id) as total, branch_id, branch_name, count(*) as count "+
    "from ORDER_STORE_STOCK_VIEW "+
    "where order_date > ? and order_date < ?";