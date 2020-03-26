CREATE TABLE IF NOT EXISTS `BRANCH_STOCK` (
  `id` INT NOT NULL,
  `product_name` VARCHAR(100) NULL,
  `product_code` VARCHAR(45) NULL,
  `qty` INT NULL,
  `unit_price` DOUBLE NULL,
  `branch_id` INT NULL,
  `last_updated_date` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_BRANCH_STOCK_ORG_BRANCH_idx` (`branch_id` ASC),
  CONSTRAINT `fk_BRANCH_STOCK_ORG_BRANCH`
    FOREIGN KEY (`branch_id`)
    REFERENCES `SWYFTR`.`ORG_BRANCH` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;