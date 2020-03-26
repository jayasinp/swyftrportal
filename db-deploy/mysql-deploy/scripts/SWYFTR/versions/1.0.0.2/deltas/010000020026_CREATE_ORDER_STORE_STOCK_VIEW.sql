CREATE
VIEW `ORDER_STORE_STOCK_VIEW` AS
    SELECT 
        `odr`.`order_address` AS `order_address`,
        `odr`.`order_date` AS `order_date`,
        `odr`.`status` AS `status`,
        `odr`.`org_id` AS `org_id`,
        `og`.`name` AS `name`,
        `obs`.`order_id` AS `order_id`,
        `obs`.`branch_stock_id` AS `branch_stock_id`,
        `obs`.`quantity` AS `quantity`,
        `bs`.`unit_price` AS `unit_price`,
        `bs`.`product_name` AS `product_name`,
        `og`.`payment_percentage` AS `payment_percentage`,
        `ob`.`branch_name` AS `branch_name`,
        `ob`.`id` AS `branch_id`
    FROM
        ((((`ORDER` `odr`
        JOIN `ORGANIZATION` `og` ON ((`odr`.`org_id` = `og`.`org_id`)))
        JOIN `ORG_BRANCH` `ob` ON ((`odr`.`branch_id` = `ob`.`id`)))
        JOIN `ORDER_BRANCH_STOCK` `obs` ON ((`odr`.`id` = `obs`.`order_id`)))
        JOIN `BRANCH_STOCK` `bs` ON ((`obs`.`branch_stock_id` = `bs`.`id`)));