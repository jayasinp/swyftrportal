CREATE TABLE IF NOT EXISTS `USER_ADDRESS` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `address_line_1` TEXT NULL,
  `address_line_2` TEXT NULL,
  `district` VARCHAR(45) NULL,
  `province` VARCHAR(50) NULL,
  `user_id` BIGINT NULL,
  `last_updated` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ADDRESS_1_idx` (`user_id` ASC),
  CONSTRAINT `fk_ADDRESS_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `SWYFTR`.`PROFILE` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;