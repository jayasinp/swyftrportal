export const INSERT_TOKEN = "INSERT INTO `SYS_USER_TOKEN`" +
  "(`user_id`," +
  "`access_token`," +
  "`valid_till`," +
  "`active`," +
  "`refresh_token`)" +
  "VALUES" +
  "(?);";

export const INVALIDATE_TOKENS_OF_A_USER = "update SYS_USER_TOKEN set active=0 where user_id=?";

export const GET_ACTIVE_TOKEN_BY_USER_NAME = "SELECT T.user_id, T.access_token, T.valid_till " +
  "FROM " +
  "SYS_USER_TOKEN T INNER JOIN SYS_USER_PROFILE P ON T.user_id = P.user_id " +
  "WHERE T.active=1 AND P.email=?";
