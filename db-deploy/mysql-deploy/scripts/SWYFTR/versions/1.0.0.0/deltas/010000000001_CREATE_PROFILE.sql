CREATE TABLE IF NOT EXISTS `PROFILE` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `dob` VARCHAR(10) NULL,
  `email` VARCHAR(100) NULL,
  `phone_no` VARCHAR(15) NULL,
  `mobile_no` VARCHAR(15) NULL,
  `nic` VARCHAR(15) NULL,
  `added_date` BIGINT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;