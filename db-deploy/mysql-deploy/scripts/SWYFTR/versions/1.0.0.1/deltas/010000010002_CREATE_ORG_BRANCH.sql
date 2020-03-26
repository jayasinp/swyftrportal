CREATE TABLE IF NOT EXISTS `ORG_BRANCH` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `org_id` INT NULL,
  `branch_name` VARCHAR(100) NULL,
  `address` TEXT NULL,
  `longtude` DOUBLE NULL,
  `latitude` DOUBLE NULL,
  `district` VARCHAR(40) NULL,
  `province` VARCHAR(45) NULL,
  `manager_user_id` BIGINT NULL,
  `added_date` BIGINT NULL,
  `active` TINYINT(1) NULL DEFAULT 1,
  `branch_phone` VARCHAR(12) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ORG_BRANCH_ORG_idx` (`org_id` ASC),
  CONSTRAINT `fk_ORG_BRANCH_ORG`
    FOREIGN KEY (`org_id`)
    REFERENCES `SWYFTR`.`ORGANIZATION` (`org_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
