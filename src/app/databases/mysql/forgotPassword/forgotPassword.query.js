export const INSERT_FORGOT_PASSWORD_LINK_DATA = "INSERT INTO `FORGOT_PASSWORD`" +
  "(`user_id`, " +
  "`email`, " +
  "`token`, " +
  "`user_type`, " +
  "`added_date`) " +
  "VALUES (?, ?, ?, ?, ?)";

export const GET_ENTRY_BY_TOKEN_AND_USER_TYPE = "SELECT * " +
  "FROM FORGOT_PASSWORD " +
  "WHERE token=? AND user_type=? " +
  "AND (unix_timestamp(NOW())*1000 - added_date) < ?";

export const DELETE_ENTRY_BY_TOKEN = "DELETE FROM `FORGOT_PASSWORD`" +
  "WHERE token=? ";
