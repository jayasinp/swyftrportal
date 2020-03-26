export const INSERT_USER_PERMISSIONS = "INSERT INTO `USER_PERMISSIONS` " +
  "(`user_id`, " +
  "`permission_id`, " +
  "`added_date`, " +
  "`revoked`) " +
  "VALUES " +
  "(?, ?, ?, ?) " +
  "ON DUPLICATE KEY " +
  "UPDATE added_date=?, revoked=?";

export const GET_ALL_PERMISSIONS_FOR_USER = "SELECT permission_id, revoked " +
  "FROM USER_PERMISSIONS " +
  "WHERE user_id=? ";

export const REVOKE_PERMISSION_FROM_USER = "UPDATE USER_PERMISSIONS " +
  "SET revoked=1 WHERE user_id=? AND permission_id=? ";

export const IS_USER_HAVE_PERMISSION = "SELECT user_id " +
  "FROM USER_PERMISSIONS " +
  "WHERE user_id=? AND permission_id=? AND revoked=0 ";

export const GET_ALL_PERMISSION_TYPES = "SELECT * FROM PERMISSION_TYPES WHERE name <> 'SUPER_USER_SWYFTR'";

export const GET_ALL_PERMISSION_TYPES_FOR_USER = "SELECT T.id, T.name, T.description " +
  "FROM USER_PERMISSIONS U INNER JOIN PERMISSION_TYPES T " +
  "ON T.id = U.permission_id " +
  "WHERE U.user_id=? AND U.revoked=0";
