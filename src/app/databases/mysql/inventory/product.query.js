export const INSERT_PRODUCT = "INSERT INTO `BRANCH_STOCK`"+
  "(`product_name`,"+
  "`product_code`,"+
  "`qty`,"+
  "`unit_price`,"+
  "`branch_id`,"+
  "`last_updated_date`,"+
  "`category_id`,"+
  "`description`,"+
  "`discount`,"+
"`sftrDiscount`,"+
  "`availability`,"+
  "`special_note`,"+
  "`tags`)"+
  "VALUES"+
  "(?);";

export const UPDATE_PRODUCT = "UPDATE `BRANCH_STOCK`"+
  "SET"+
  "`product_name` = ?,"+
  "`product_code` = ?,"+
  "`qty` = ?,"+
  "`unit_price` = ?,"+
  "`branch_id` = ?,"+
  "`last_updated_date` = ?,"+
  "`category_id` = ?, "+
  "`description` = ?,"+
  "`discount` = ?,"+
 "`sftrDiscount` = ?,"+
  "`availability` = ?,"+
  "`special_note` = ?, "+
  "`tags` = ? "+
  "WHERE `id` = ?";

  export const UPDATE_PRODUCT_QUANTITY = "UPDATE `BRANCH_STOCK`"+
  "SET"+
  "`qty` = `qty` - ?,"+
  "WHERE `id` = ?";

export const DELETE_PRODUCT = "DELETE FROM `BRANCH_STOCK`"+
  "WHERE `id` = ?";

export const GET_PRODUCT_BY_BRANCH = "SELECT * FROM BRANCH_STOCK WHERE branch_id = ?";

export const GET_PRODUCT_BY_IDS = "SELECT * FROM BRANCH_STOCK WHERE id IN (?) ";

export const GET_PRODUCT_BY_NAME = "SELECT * FROM BRANCH_STOCK WHERE product_name LIKE ? ";

export const GET_PRODUCT_BRANCH_ORG_BY_NAME = "SELECT BS.*, "+
  "OB.branch_name, OB.org_id, OG.name as org_name, SA.given_name as branch_logo "+
  "FROM BRANCH_STOCK BS "+
  "INNER JOIN ORG_BRANCH OB "+
  "ON BS.branch_id = OB.id "+
  "INNER JOIN ORGANIZATION OG "+
  "ON OB.org_id = OG.org_id "+
  "LEFT JOIN SYSTEM_ASSETS SA "+
  "ON SA.id = OB.logo "+
  "WHERE OG.active = 1 AND BS.product_name LIKE ?";

export const INSERT_STOCK_ASSET = "INSERT INTO `STOCK_SYSTEM_ASSETS`"+
  "(`stock_id`,"+
  "`system_asset_id`,"+
  "`added_date`)"+
  "VALUES "+
  "(?)";

export const GET_STOCK_ASSET_BY_PRODUCTS = "SELECT * from `STOCK_SYSTEM_ASSETS` where stock_id IN (?) ";

export const GET_STOCK_ASSET_AND_IMAGES_BY_PRODUCTS = "SELECT * "+
  "FROM `STOCK_SYSTEM_ASSETS` SSA "+
  "LEFT JOIN `SYSTEM_ASSETS` SA "+
  "ON SSA.system_asset_id = SA.id "+
  "where SSA.stock_id IN (?)";

export const DELETE_STOCK_ASSET = "DELETE FROM `STOCK_SYSTEM_ASSETS` "+
  "WHERE stock_id = ?";

  

export const UPDATE_PRODUCT_AVALIB = "UPDATE `BRANCH_STOCK`"+
  "SET"+
  "`product_name` = ?,"+
  "`product_code` = ?,"+
  "`last_updated_date` = ?,"+
  "`availability` = ?"+
  "WHERE `id` = ?";