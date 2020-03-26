export const INSERT_ORDER = "INSERT INTO `ORDER`"+
  "(`order_address`,"+
  "`customer`,"+
  "`delivery_required`,"+
  "`order_date`,"+
  "`status`,"+
  "`org_id`,"+
  "`branch_id`," +
  "`lat`," +
  "`long`,"+
  "`delivery_date`," +
  "`delivery_eta`," +
  "`delivery_cost`, "+
  "`delivery_contact_number`, "+
  "`written_address`, "+
  "`payment_status`) "+
"VALUES"+
"(?);";

export const INSERT_ORDER_ITEMS = "INSERT INTO `ORDER_BRANCH_STOCK`"+
"(`order_id`,"+
"`branch_stock_id`,"+
"`quantity`)"+
"VALUES"+
" ?";

export const UPDATE_ORDER = "UPDATE `ORDER`"+
"SET"+
"`order_address` = ?,"+
"`customer` = ?,"+
"`delivery_required` = ?,"+
"`order_date` = ?,"+
"`status` = ?,"+
"`org_id` = ?,"+
"`branch_id` = ?,"+
"`lat` = ?,"+
"`long` = ?, "+
"`delivery_date` = ?, "+
"`delivery_eta` = ?, "+
"`delivery_cost` = ?, "+
"`delivery_contact_number` = ?, "+
"`written_address` = ? "+
"WHERE `id` = ?";

export const UPDATE_ORDER_STATUS = "UPDATE `ORDER`"+
"SET"+
"`status` = ?"+
"WHERE `id` = ?";

export const UPDATE_ORDER_RIDER_PICKED_STATUS = "UPDATE `ORDER` "+
"SET "+
"`rider_picked` = ? "+
"WHERE `id` = ?";

export const UPDATE_ORDER_CUSTOMER_PICKED_STATUS = "UPDATE `ORDER` "+
"SET "+
"`customer_picked` = ? "+
"WHERE `id` = ?";

export const UPDATE_ORDER_QR = "UPDATE `ORDER`"+
"SET"+
"`qr` = ?, "+
"`qr_salt` = ?"+
"WHERE `id` = ?";

export const DELETE_ORDER_ITEMS = "DELETE FROM `ORDER_BRANCH_STOCK`"+
"WHERE"+
"`order_id` = ?";

export const DELETE_ORDER = "DELETE FROM `ORDER`"+
"WHERE"+
"`id` = ?";

export const GET_ORDER_BY_CUSTOMER = "SELECT * "+
"FROM `ORDER` O "+
"where customer = ?";

export const GET_RIDER_BY_ORDER_ID = "SELECT * "+
"FROM `ORDER` O "+
"where rider = ?";

export const GET_ORDER_BY_ID = "SELECT O.*, B.longtude AS branch_long , B.latitude AS branch_lat "+
  "FROM `ORDER` O " +
  "INNER JOIN ORG_BRANCH B ON B.id = O.branch_id " +
  "where O.id = ?";

export const GET_QR_SALT = "SELECT qr_salt "+
"FROM `ORDER` "+
"where id = ?";

export const GET_ORDER_ITEMS = "SELECT *"+
"FROM ORDER_BRANCH_STOCK O "+
"INNER JOIN BRANCH_STOCK B "+
"ON O.branch_stock_id = B.id "+
"WHERE O.order_id = ?";

export const GET_ORDER_AND_CUSTOMER_BY_RIDER_AND_STATUS = "SELECT O.*, C.name AS org_name, " +
  "CONCAT(P.first_name, \" \", P.last_name) AS cus_name, P.mobile_no, P.nic, " +
  "B.longtude AS b_longtude, " +
  "B.branch_name, B.latitude AS b_latitude, SUM(W.quantity * W.unit_price) as total, P.email as cus_email " +
  "FROM `ORDER` O " +
  "INNER JOIN ORGANIZATION C ON C.org_id=O.org_id " +
  "INNER JOIN ORG_BRANCH B ON B.id = O.branch_id " +
  "INNER JOIN PROFILE P ON P.user_id = O.customer " +
  "INNER JOIN ORDER_STORE_STOCK_VIEW W ON W.order_id = O.id " +
  "WHERE O.rider=? AND O.status IN (?)" +
  "group by W.order_id";

export const GET_ALL_ORDERS = "SELECT O.*, " +
  "B.longtude AS b_longtude, " +
  "B.latitude AS b_latitude, " +
  "CONCAT(P.first_name, \" \", P.last_name) AS cus_name, " +
  "R.name AS org_name, B.branch_name," +
  "CONCAT(S.first_name, \" \", S.last_name) AS rider_name, " +
  "GROUP_CONCAT(A.product_name) AS products " +
  "FROM `ORDER` O " +
  "INNER JOIN PROFILE P ON O.customer = P.user_id " +
  "INNER JOIN ORGANIZATION R ON O.org_id = R.org_id " +
  "INNER JOIN ORG_BRANCH B ON B.id = O.branch_id " +
  "INNER JOIN ORDER_BRANCH_STOCK T ON T.order_id = O.id " +
  "INNER JOIN BRANCH_STOCK A ON A.id = T.branch_stock_id " +
  "LEFT JOIN SYS_USER_PROFILE S ON S.user_id = O.rider ";


export const INCREASE_GROUP_CONCAT_SIZE = "SET group_concat_max_len=500000";

export const GET_ORDER_INFO_BY_ID_FOR_ADMIN = "SELECT " +
  "S.id as prod_id, S.product_name, S.unit_price, S.category_id, " +
  "S.description, S.discount, S.sftrDiscount, S.availability, B.quantity, " +
  "group_concat(A.system_asset_id, \"|\") AS prod_image_id " +
  "FROM `ORDER` O " +
  "INNER JOIN ORDER_BRANCH_STOCK B ON B.order_id = O.id " +
  "INNER JOIN BRANCH_STOCK S ON S.id = B.branch_stock_id " +
  "LEFT JOIN STOCK_SYSTEM_ASSETS A ON A.stock_id = S.id " +
  "WHERE O.id = ? " +
  "GROUP BY S.id ";

export const GET_ORDER_CUS_DETAILS = "SELECT " +
  "P.first_name, P.last_name, P.email, P.mobile_no, P.phone_no, O.order_address " +
  "FROM `ORDER` O " +
  "INNER JOIN PROFILE P ON P.user_id = O.customer " +
  "WHERE O.id = ?";

export const RE_ADD_TO_STOCK = "UPDATE BRANCH_STOCK SET qty = (qty + ?) WHERE id=?";

export const UPDATE_RIDER_ID = "UPDATE `ORDER` SET rider = ? WHERE `id` = ?"

export const GET_ORDERS_OF_RIDER_BY_STATUS = "SELECT * FROM `ORDER` WHERE rider=? AND status in (?)"

export const UPDATE_RIDER_CONSENT = "UPDATE `ORDER` SET rider_viewed=1 WHERE id=? AND rider=?"

export const SET_RIDER_MANUALLY = "UPDATE `ORDER` SET rider=? WHERE id=? "

export const GET_ORDERS_IN_STATUS_ARRAY = "SELECT O.*, C.name AS org_name, " +
  "CONCAT(P.first_name, \" \", P.last_name) AS cus_name, " +
  "B.longtude AS b_longtude, " +
  "B.branch_name, B.latitude AS b_latitude " +
  "FROM `ORDER` O " +
  "INNER JOIN ORGANIZATION C ON C.org_id=O.org_id " +
  "INNER JOIN ORG_BRANCH B ON B.id = O.branch_id " +
  "INNER JOIN PROFILE P ON P.user_id = O.customer " +
  "WHERE O.rider IS NULL AND O.status IN (?)"

export const GET_ORDER_FOR_EMAIL = "SELECT O.delivery_cost, O.order_address as to_address, O.delivery_eta as arrive_time, " +
  "B.address as from_address, P.email " +
  "FROM `ORDER` O " +
  "INNER JOIN ORG_BRANCH B ON B.id=O.branch_id " +
  "INNER JOIN PROFILE P ON P.user_id=O.customer " +
  "WHERE O.id = ? "

export const GET_ORDER_ITEMS_FOR_EMAIL = "SELECT B.product_name, B.product_code, A.quantity, B.unit_price, B.discount " +
  "FROM ORDER_BRANCH_STOCK A " +
  "INNER JOIN BRANCH_STOCK B ON B.id=A.branch_stock_id " +
  "WHERE A.order_id=? "
