export const CREATE_AUTH_ENTRY = "INSERT INTO `AUTH`" +
  "(`user_id`," +
  "`password`," +
  "`salt`," +
  "`last_updated`," +
  "`active`)" +
  "VALUES" +
  "(?);";

export const GET_PASSWORD_OF_EMAIL = "SELECT A.password, A.salt, A.user_id, P.otp " +
  "FROM PROFILE P INNER JOIN AUTH A ON A.user_id = P.user_id " +
  "WHERE A.active = 1 AND P.email = ?";

export const UPDATE_PASSWORD_BY_USER_ID = "UPDATE AUTH " +
  "SET password=?, " +
  "salt=?, " +
  "last_updated=? " +
  "WHERE  user_id=?";
