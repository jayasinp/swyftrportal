export const CREATE_STORE = "INSERT INTO `ORG_BRANCH`" +
  "(`org_id`," +
  "`branch_name`," +
  "`address`," +
  "`longtude`," +
  "`latitude`," +
  "`district`," +
  "`province`," +
  "`manager_user_id`," +
  "`added_date`," +
  "`active`," +
  "`branch_phone`," +
  "`logo`," +
  "`display_image`," +
  "`slogan`)" +
  "VALUES" +
  "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

export const GET_STORE_BY_NAME = "SELECT * FROM ORG_BRANCH WHERE branch_name=? AND org_id=?";

export const GET_STORE_BY_STORE_ID = "SELECT * FROM ORG_BRANCH WHERE id=?";

export const GET_STORE_WITH_IMAGES_BY_STORE_ID = "SELECT O.*, S.given_name as branch_logo_image, S1.given_name as branch_display_image "+
  "FROM ORG_BRANCH O "+
  "LEFT JOIN SYSTEM_ASSETS S "+
  "ON O.display_image = S.id "+
  "LEFT JOIN SYSTEM_ASSETS S1 "+
  "ON O.logo = S1.id "+
  "WHERE O.id=? ";



   export const GET_USER_STORE_WITH_IMAGES_BY_STORE_ID = "SELECT O.*, S.given_name as branch_logo_image, S1.given_name as branch_display_image "+
  "FROM ORG_BRANCH O "+
  "LEFT JOIN SYSTEM_ASSETS S "+
  "ON O.display_image = S.id "+
  "LEFT JOIN SYSTEM_ASSETS S1 "+
  "ON O.logo = S1.id "+
  "WHERE  O.manager_user_id IN (?) ";

export const UPDATE_STORE_BY_STORE_ID = "UPDATE ORG_BRANCH " +
  "SET address=?, longtude=?, latitude=?, "+
  "district=?, province=?, manager_user_id=?, branch_phone=?, logo=?, display_image=?, slogan=? " +
  "WHERE id=?";

 export const UPDATE_STORE_ONLINE_STATUS_BY_STORE_ID = "UPDATE ORG_BRANCH " +
  "SET active=? "+
  "WHERE id=?";

export const UPDATE_STORE_ONLINE_STATUS_BY_ID = "UPDATE ORG_BRANCH " +
 "SET online_status=? "+
 "WHERE id=?";

export const GET_STORES_BY_PARTNER_ID = "SELECT * FROM ORG_BRANCH WHERE org_id=?";

export const GET_STORES_BY_USER_ID = "SELECT * FROM ORG_BRANCH WHERE manager_user_id=?";


export const GET_PRODUCTS_BY_STORE = "SELECT BS.*,CA.category_name "+
"FROM BRANCH_STOCK BS "+
"INNER JOIN CATEGORY CA "+
"ON BS.category_id = CA.id "+
"WHERE BS.branch_id = ?";

//export const GET_USER_PRODUCTS_BY_STORE =  "SELECT BS.*,CA.category_name "+
//"FROM BRANCH_STOCK BS "+
//"INNER JOIN CATEGORY CA "+
//"ON BS.category_id = CA.id "+
//"WHERE BS.branch_id IN (?)";
//"WHERE BS.branch_id = ?";
//"WHERE BS.manager_user_id IN (15,16,22)";
//"WHERE BS.manager_user_id = ?";


export const GET_USER_PRODUCTS_BY_STORE = "SELECT BS.*,CA.category_name , OB.branch_name "+
" FROM  BRANCH_STOCK BS "+
"INNER JOIN  CATEGORY CA "+
" INNER JOIN ORG_BRANCH OB "+
" ON BS.category_id = CA.id "+
 " and OB.id = BS.branch_id "+
 " WHERE OB.manager_user_id IN (?)"


export const GET_STORES_COUNT = "SELECT count(*) as rows "+
"FROM ORGANIZATION O "+
"INNER JOIN ORG_BRANCH B "+
"ON O.org_id = B.org_id";

export const GET_ALL_STORES = "SELECT O.*,B.*, O.org_id as org_id, S.file as partner_logo, "+
"S1.file as store_logo, S2.file as store_display_image, B.active as branch_active "+
"FROM ORGANIZATION O "+
"INNER JOIN ORG_BRANCH B "+
"ON O.org_id = B.org_id "+
"LEFT JOIN SYSTEM_ASSETS S "+
"ON O.logo_id = S.id "+
"LEFT JOIN SYSTEM_ASSETS S1 "+
"ON B.logo = S1.id "+
"LEFT JOIN SYSTEM_ASSETS S2 "+
"ON B.display_image = S2.id "+
"WHERE B.online_status = 1 "+
"ORDER BY O.name "+
"LIMIT ?,?";
