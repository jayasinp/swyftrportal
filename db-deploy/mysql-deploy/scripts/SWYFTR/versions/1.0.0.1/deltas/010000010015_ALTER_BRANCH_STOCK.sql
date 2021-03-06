ALTER TABLE `BRANCH_STOCK` 
ADD COLUMN `category_id` BIGINT(20) NULL DEFAULT NULL AFTER `last_updated_date`,
ADD INDEX `fk_BRANCH_STOCK_2_idx` (`category_id` ASC);
ALTER TABLE `BRANCH_STOCK` 
ADD CONSTRAINT `fk_BRANCH_STOCK_2`
  FOREIGN KEY (`category_id`)
  REFERENCES `CATEGORY` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;