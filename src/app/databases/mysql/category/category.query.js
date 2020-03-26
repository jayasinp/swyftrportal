export const GET_SUB_CATEGORY = "SELECT * FROM CATEGORY WHERE parent_category = ? ";

export const GET_PARENT_CATEGORY = "SELECT * FROM CATEGORY WHERE parent_category is null ";

export const GET_STORES_BY_CATEGORY = "SELECT distinct o.*, g.logo_id as org_logo_id, S1.given_name as branch_logo_image "+
    "FROM BRANCH_STOCK s "+
    "INNER JOIN ORG_BRANCH o "+
    "ON s.branch_id = o.id "+
    "INNER JOIN ORGANIZATION g "+
    "ON o.org_id = g.org_id "+
    "LEFT JOIN SYSTEM_ASSETS S1 "+
    "ON o.logo = S1.id "+
    "where g.active = 1 AND s.category_id = ? and o.active = 1 and o.online_status = 1";