CREATE TABLE IF NOT EXISTS `SYS_USER_PROFILE` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `dob` VARCHAR(12) NULL,
  `email` VARCHAR(100) NULL,
  `phone_no` VARCHAR(15) NULL,
  `mobile_no` VARCHAR(15) NULL,
  `user_type` ENUM('rider', 'partner', 'swyftr') NULL,
  `nic` VARCHAR(15) NULL,
  `added_date` BIGINT NULL,
  `address` TEXT NULL,
  `org_id` INT NULL,
  `designation` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_SYS_USER_PROFILE_ORG_idx` (`org_id` ASC),
  CONSTRAINT `fk_SYS_USER_PROFILE_ORG`
    FOREIGN KEY (`org_id`)
    REFERENCES `SWYFTR`.`ORGANIZATION` (`org_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;