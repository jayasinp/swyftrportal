CREATE TABLE IF NOT EXISTS `ORGANIZATION` (
  `org_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(300) NULL,
  `head_office_address` TEXT NULL,
  `contact_no` VARCHAR(12) NULL,
  `org_type` ENUM('swyftr', 'partner_store', 'partner_rider') NULL,
  `bank` VARCHAR(10) NULL,
  `branch` VARCHAR(100) NULL,
  `account_number` VARCHAR(30) NULL,
  `prefered_payment_method` ENUM('cash', 'cheque') NULL,
  `branch_code` VARCHAR(10) NULL,
  `bank_swift_code` VARCHAR(10) NULL,
  `point_of_contact_name` VARCHAR(100) NULL,
  `point_of_contact_mobile` VARCHAR(12) NULL,
  `added_date` BIGINT NULL,
  PRIMARY KEY (`org_id`))
ENGINE = InnoDB;