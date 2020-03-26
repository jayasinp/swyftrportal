CREATE TABLE IF NOT EXISTS `PROFILE_ASSEST` (
  `user_id` BIGINT NOT NULL,
  `assest_type` ENUM('PP', 'NIC', 'LICENSE') NULL,
  `assest` BLOB NULL,
  `added_date` BIGINT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `name` (`assest_type` ASC, `user_id` ASC),
  CONSTRAINT `fk_PROFILE_ASSEST_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `SWYFTR`.`PROFILE` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;