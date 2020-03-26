export const INSERT_TOKEN = "INSERT INTO `USER_TOKEN`" +
  "(`user_id`," +
  "`access_token`," +
  "`valid_till`," +
  "`active`," +
  "`refresh_token`)" +
  "VALUES" +
  "(?);";

export const INVALIDATE_TOKENS_OF_A_USER = "update USER_TOKEN set active=0 where user_id=?";

export const GET_ACTIVE_TOKEN_BY_USER_NAME = "SELECT T.user_id, T.access_token, T.valid_till " +
  "FROM " +
  "USER_TOKEN T INNER JOIN PROFILE P ON T.user_id = P.user_id " +
  "WHERE T.active=1 AND P.email=?";
