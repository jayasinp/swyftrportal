export const CREATE_AUTH_ENTRY = "INSERT INTO `SYS_AUTH`" +
  "(`sys_user_id`," +
  "`password`," +
  "`salt`," +
  "`last_updated`," +
  "`active`)" +
  "VALUES" +
  "(?);";

export const GET_PASSWORD_OF_EMAIL = "SELECT A.password, A.salt, A.sys_user_id, P.user_type " +
  "FROM SYS_USER_PROFILE P INNER JOIN SYS_AUTH A ON A.sys_user_id = P.user_id " +
  "WHERE A.active = 1 AND P.email = ?";

export const UPDATE_PASSWORD_BY_USER_ID = "UPDATE SYS_AUTH " +
  "SET password=?, " +
  "salt=?, " +
  "last_updated=? " +
  "WHERE  sys_user_id=?";