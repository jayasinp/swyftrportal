export const CREATE_PROFILE = "INSERT INTO `SYS_USER_PROFILE`" +
  "(`first_name`," +
  "`last_name`," +
  "`dob`," +
  "`email`," +
  "`phone_no`," +
  "`mobile_no`," +
  "`user_type`," +
  "`nic`," +
  "`added_date`," +
  "`address`," +
  "`org_id`," +
  "`designation`," +
  "`profie_pic_id`) " +
  "VALUES" +
  "(?)";

export const CHECK_USER_EXIST = "SELECT count(*) as user_count FROM SYS_USER_PROFILE WHERE email=? OR mobile_no=? OR nic=?";

export const GET_USER_BY_ID_OR_EMAIL = "SELECT * FROM SYS_USER_PROFILE WHERE email=? OR user_id=?";

export const UPDATE_USER_BY_USER_ID = "UPDATE `SYS_USER_PROFILE`" +
  "SET" +
  "`first_name` = ?, " +
  "`last_name` = ?, " +
  "`dob` = ?, " +
  "`phone_no` = ?, " +
  "`mobile_no` = ?, " +
  "`address` = ?, " +
  "`designation` = ?, " +
  "`profie_pic_id` = ?, " +
  "`org_branch` = ? " +
  "WHERE `user_id` = ?";

export const UPDATE_USER_BY_EMAIL = "UPDATE `SYS_USER_PROFILE`" +
  "SET" +
  "`first_name` = ?, " +
  "`last_name` = ?, " +
  "`dob` = ?, " +
  "`phone_no` = ?, " +
  "`mobile_no` = ?, " +
  "`address` = ?, " +
  "`designation` = ?, " +
  "`profie_pic_id` = ?, " +
  "`org_branch` = ? " +
  "WHERE `email` = ?";

export const GET_ALL_USERS = "SELECT P.*, O.name AS org_name FROM SYS_USER_PROFILE P " +
  "INNER JOIN " +
  "ORGANIZATION O ON " +
  "P.org_id=O.org_id ";

export const CHANGE_USER_ACTIVE_STATUS = "UPDATE SYS_AUTH set active=? WHERE sys_user_id=?";

export const GET_RIDERS_BY_ORG_ID = "SELECT S.*, R.license_no, R.vehicle_no, R.status, " +
  "group_concat(UP.permission_id separator \", \") as permissions " +
  "FROM " +
  "SYS_USER_PROFILE S " +
  "LEFT JOIN RIDER_INFO R ON R.user_id = S.user_id " +
  "LEFT JOIN USER_PERMISSIONS UP ON UP.user_id = S.user_id " +
  "WHERE S.user_type=\"rider\" AND S.org_id=? " +
  "GROUP BY S.user_id "
