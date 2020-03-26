ALTER TABLE `ORGANIZATION`
CHANGE COLUMN `org_type` `org_type` ENUM('swyftr', 'partner_supplier', 'partner_store', 'partner_rider') NULL DEFAULT NULL ;
