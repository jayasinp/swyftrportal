export const CREATE_USER_ADDRESS = "INSERT INTO `USER_ADDRESS`" +
  "(`address_line_1`," +
  "`address_line_2`," +
  "`district`," +
  "`province`," +
  "`user_id`," +
  "`last_updated`)" +
  "VALUES" +
  "(?)";

export const GET_USER_BY_USER_ID = "SELECT * FROM USER_ADDRESS WHERE user_id=?";

export const GET_USER_BY_ADDRESS_ID = "SELECT * FROM USER_ADDRESS WHERE id=?";

export const GET_ADDRESS_BY_USER_ID = "SELECT * FROM USER_ADDRESS WHERE user_id=?";


export const REMOVE_ADDRESS_BY_ADDRESS_ID = "DELETE FROM `USER_ADDRESS`WHERE id=?"

export const UPDATE_USER_ADDRESS = 'UPDATE `USER_ADDRESS` ' +
  'SET address_line_1=?, address_line_2=?, district=?, province=?, last_updated=? ' +
  'WHERE id=?';

export const UPDATE_USER_ADDRESS_ByUId = 'UPDATE `USER_ADDRESS` ' +
  'SET address_line_1=?, address_line_2=?, district=?, province=?, last_updated=? ' +
  'WHERE user_id=?';