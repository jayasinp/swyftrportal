ALTER TABLE `ORGANIZATION`
ADD COLUMN `active` TINYINT(1) NOT NULL DEFAULT 1 AFTER `added_date`;
UPDATE `ORGANIZATION` SET added_date=UNIX_TIMESTAMP()*1000, active=1 WHERE org_id=1;