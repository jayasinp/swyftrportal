export const INSERT_ORGANIZATION = "INSERT INTO `ORGANIZATION`" +
  "(`name`," +
  "`head_office_address`," +
  "`contact_no`," +
  "`org_type`," +
  "`bank`," +
  "`branch`," +
  "`account_number`," +
  "`prefered_payment_method`," +
  "`branch_code`," +
  "`bank_swift_code`," +
  "`point_of_contact_name`," +
  "`point_of_contact_mobile`," +
  "`added_date`," +
  "`logo_id`," +
  "`active`," +
  "`tags`)" +
  "VALUES" +
  "(?);";

export const GET_ORGANIZATION_BY_ORG_ID = "SELECT * FROM ORGANIZATION WHERE org_id=?"

export const GET_ORGANIZATION_BY_USER_ID = "SELECT * FROM ORG_BRANCH WHERE manager_user_id=?"

export const GET_ORGANIZATION_LOGOS_BY_ORG_IDS = "SELECT * "+
  "FROM ORGANIZATION O "+
  "LEFT JOIN SYSTEM_ASSETS S "+
  "ON O.logo_id = S.id "+
  "WHERE O.org_id in (?)";

export const GET_ORGANIZATION_BY_NAME = "SELECT * FROM ORGANIZATION WHERE name like ? AND active=?"
//given_name
export const GET_ORGANIZATION_BY_NAME_IMAGE = "SELECT O.*, S.given_name  "+
  "FROM ORGANIZATION O "+
  "LEFT JOIN SYSTEM_ASSETS S "+
  "ON O.logo_id = S.id "+
  "WHERE O.active = 1 AND O.name like ? AND O.active=?"

export const UPDATE_ORGANIZATION = "UPDATE `ORGANIZATION`" +
  "SET " +
  "`name` = ?," +
  "`head_office_address` = ?," +
  "`contact_no` = ?," +
  "`point_of_contact_name` = ?, " +
  "`point_of_contact_mobile` = ?, " +
  "`logo_id` = ?, " +
  "`tags` = ? " +
  "WHERE `org_id` = ? ";

export const CHANGE_PARTNER_STATUS = "UPDATE ORGANIZATION SET active=? WHERE org_id=?";
