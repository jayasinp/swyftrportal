export const GET_RATING_ORDER = "SELECT * FROM USER_RATING WHERE order_id = ? ";

export const GET_RATING_ORDER_BY_ORDER_AND_USER_AND_USERTYPE = "SELECT * FROM USER_RATING WHERE order_id = ? AND user_id = ? AND user_type = ?";

export const INSERT_RATING = "INSERT INTO USER_RATING "+
    "(`order_id`,"+
    "`user_id`,"+
    "`user_type`,"+
    "`customer_rating`,"+
    "`rider_rating`,"+
    "`store_rating`,"+
    "`swyftr_rating`)"+
    "VALUES"+
    "(?)";
