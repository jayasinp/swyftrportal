CREATE TABLE IF NOT EXISTS `SYS_AUTH` (
  `password` VARCHAR(300) NULL,
  `salt` VARCHAR(300) NULL,
  `last_updated` BIGINT NULL,
  `active` TINYINT NULL,
  `sys_user_id` BIGINT NOT NULL,
  INDEX `user_active` (`active` ASC),
  PRIMARY KEY (`sys_user_id`),
  CONSTRAINT `fk_SYS_AUTH_PROFILE_copy11`
    FOREIGN KEY (`sys_user_id`)
    REFERENCES `SWYFTR`.`SYS_USER_PROFILE` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;