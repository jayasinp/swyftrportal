CREATE TABLE IF NOT EXISTS `RIDER_INFO` (
  `user_id` INT NOT NULL,
  `nic_number` VARCHAR(12) NULL,
  `license_no` VARCHAR(12) NULL,
  `vehicle_no` VARCHAR(12) NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;