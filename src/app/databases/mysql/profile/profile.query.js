export const CREATE_PROFILE = "INSERT INTO `PROFILE`" +
  "(`first_name`," +
  "`last_name`," +
  "`dob`," +
  "`email`," +
  "`phone_no`," +
  "`mobile_no`," +
  "`nic`," +
  "`added_date`," +
  "`profile_pic_id`, " +
  "`otp`, " +
  "`otp_retry_count`) " +
  "VALUES" +
  "(?)";

export const CHECK_USER_EXIST = "SELECT count(*) as user_count FROM PROFILE WHERE email=? OR mobile_no=?";

export const CHECK_USER_EXIST_NIC_CHECK = "SELECT count(*) as user_count FROM PROFILE WHERE email=? OR mobile_no=? OR nic=?";

export const GET_USER_BY_ID_OR_EMAIL = "SELECT * FROM PROFILE WHERE email=? OR user_id=?";

export const UPDATE_USER_BY_USER_ID = "UPDATE `PROFILE`" +
  "SET" +
  "`first_name` = ?," +
  "`last_name` = ?," +
  "`dob` = ?," +
  "`phone_no` = ?," +
  "`mobile_no` = ?," +
  "`profile_pic_id` = ? " +
  "WHERE `user_id` = ?";

export const UPDATE_DEVICE_ID_BY_USER_ID = "UPDATE `PROFILE` SET `device_id`=?, `device_os`=? WHERE `user_id`=? ";

export const GET_ALL_CUSTOMERS_BY_STATUS = "SELECT P.* " +
  "FROM PROFILE P INNER JOIN AUTH A " +
  "ON A.user_id=P.user_id " +
  "WHERE A.active=? "

export const CHANGE_CUSTOMER_STATUS = "UPDATE AUTH SET active=? WHERE user_id=? ";

export const UPDATE_OTP = "UPDATE PROFILE SET otp=? WHERE user_id=? ";

export const UPDATE_OTP_COUNT = "UPDATE PROFILE SET otp_retry_count=? WHERE user_id=? ";
