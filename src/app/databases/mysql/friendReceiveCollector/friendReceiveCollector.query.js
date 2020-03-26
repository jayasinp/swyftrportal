export const INSERT_ORDER_FRIEND_RECEIVE_COLLECTOR = "INSERT INTO `FRIEND_RECEIVE_COLLECTOR`"+
"(`rider_id`,"+
"`order_id`,"+
"`signature`,"+
"`collector_name`,"+
"`collector_contact`,"+
"`collector_nic`)"+
"VALUES"+
"(?)";

export const UPDATE_ORDER_FRIEND_RECEIVE = "UPDATE `ORDER_FRIEND_RECEIVE`"+
"SET "+
"`name` = ?, "+
"`address` = ?, "+
"`phone` = ?, "+
"`order_id` = ? "+
"WHERE `id` = ?";

export const DELETE_ORDER_FRIEND_RECEIVE = "DELETE FROM `ORDER_FRIEND_RECEIVE` "+
"WHERE `id` = ?";

export const DELETE_ORDER_FRIEND_RECEIVE_BY_ORDER_ID = "DELETE FROM `ORDER_FRIEND_RECEIVE` "+
"WHERE `order_id` = ?";

export const SELECT_ORDER_FRIEND_RECEIVE = "SELECT * FROM `ORDER_FRIEND_RECEIVE` "+
"WHERE `id` = ?";

export const SELECT_ORDER_FRIEND_RECEIVE_BY_ORDER_ID = "SELECT * FROM `ORDER_FRIEND_RECEIVE` "+
"WHERE `order_id` = ?";