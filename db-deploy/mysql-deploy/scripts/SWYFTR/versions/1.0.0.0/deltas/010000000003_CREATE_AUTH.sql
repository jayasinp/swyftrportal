CREATE TABLE IF NOT EXISTS `AUTH` (
  `user_id` BIGINT NOT NULL,
  `password` VARCHAR(300) NULL,
  `salt` VARCHAR(300) NULL,
  `last_updated` BIGINT NULL,
  `active` TINYINT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `user_active` (`user_id` ASC, `active` ASC),
  CONSTRAINT `fk_AUTH_PROFILE1`
    FOREIGN KEY (`user_id`)
    REFERENCES `SWYFTR`.`PROFILE` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;