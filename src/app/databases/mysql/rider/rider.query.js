export const CREATE_OR_UPDATE_RIDER_INFO = 'INSERT INTO `RIDER_INFO` ' +
  '(`user_id`, ' +
  '`nic_number`, ' +
  '`license_no`, ' +
  '`vehicle_no`) ' +
  'VALUES ' +
  '(?, ?, ?, ?) ON DUPLICATE KEY ' +
  'UPDATE nic_number=?, license_no=?, vehicle_no=?';

export const UPDATE_RIDER_STATUS = 'UPDATE `RIDER_INFO` SET status=? WHERE user_id=?';

export const GET_RIDER_INFO = 'SELECT * FROM `RIDER_INFO` WHERE user_id=?';

export const GET_ONGOING_DELIVERY_LOCATIONS_FOR_RIDER = 'SELECT O.lat, O.long ' +
  'FROM `ORDER` O ' +
  'WHERE O.rider = ? AND O.status = ?';

export const GET_RIDER_INFO_AND_RIDER_PROFILE = 'SELECT R.*, P.first_name, P.last_name, P.mobile_no ' +
  'FROM `ORDER` O ' +
  'INNER JOIN RIDER_INFO R ON R.user_id = O.rider ' +
  'INNER JOIN SYS_USER_PROFILE P ON P.user_id = O.rider ' +
  'WHERE O.id = ?';

export const GET_RIDERS_OF_ORG = 'SELECT P.*, R.* ' +
  'FROM SYS_USER_PROFILE P ' +
  'INNER JOIN RIDER_INFO R ON R.user_id=P.user_id ' +
  'WHERE P.org_id=? AND P.user_type="rider"';

export const GET_ALL_ORDERS_ASSIGNED_TO_RIDERS = "SELECT O.*, R.status as rider_status, " +
  "CONCAT(P.first_name, \" \", P.last_name) as rider_name," +
  "CONCAT(C.first_name, \" \", C.last_name) as cus_name," +
  "C.mobile_no as cus_mobile, P.mobile_no as rider_mobile " +
  "FROM `ORDER` O " +
  "INNER JOIN RIDER_INFO R ON R.user_id = O.rider " +
  "INNER JOIN SYS_USER_PROFILE P ON P.user_id=O.rider " +
  "INNER JOIN PROFILE C ON C.user_id=O.customer " +
  "WHERE P.org_id=? AND O.status NOT IN (\"CANCELED\", \"INIT\", \"DELI\") "

export const GET_RIDER_FOR_ADMIN = "SELECT P.*, R.license_no, R.vehicle_no, R.status " +
  "FROM SYS_USER_PROFILE P " +
  "INNER JOIN RIDER_INFO R ON R.user_id=P.user_id " +
  "WHERE P.user_id=? ";
