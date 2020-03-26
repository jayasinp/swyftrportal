export const INSERT_ISSUE = "INSERT INTO ISSUES "+
  "(`subject`,"+
  "`content`,"+
  "`category`,"+
  "`order_id`)"+
  "VALUES"+
  "(?);";

export const UPDATE_ISSUE = "UPDATE ISSUES "+
  "SET"+
  "`subject` = ?,"+
  "`content` = ?,"+
  "`category` = ? "+
  "WHERE `id` = ?";

export const GET_ISSUE_BY_ID = "SELECT * "+
  "FROM ISSUES i "+
  "INNER JOIN ISSUE_CATEGORIES c "+
  "ON i.category = c.id "+
  "where i.id = ?";

export const GET_ISSUES = "SELECT * "+
  "FROM ISSUES i "+
  "INNER JOIN ISSUE_CATEGORIES c "+
  "ON i.category = c.id ";

export const DELETE_ISSUE = "DELETE FROM ISSUES "+
  "WHERE `id` = ?";