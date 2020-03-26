CREATE VIEW ORDER_STORE_STOCK_VIEW AS
SELECT odr.order_address, odr.order_date, odr.status, 
odr.org_id, og.name, obs.order_id, obs.branch_stock_id, obs.quantity, 
bs.unit_price, og.payment_percentage,ob.branch_name, ob.id as branch_id,
bs.product_name
FROM `ORDER` odr
INNER JOIN `ORGANIZATION` og
ON odr.org_id = og.org_id
INNER JOIN `ORG_BRANCH` ob
ON odr.branch_id = ob.id
INNER JOIN `ORDER_BRANCH_STOCK` obs
ON odr.id = obs.order_id
INNER JOIN `BRANCH_STOCK` bs
ON obs.branch_stock_id = bs.id;