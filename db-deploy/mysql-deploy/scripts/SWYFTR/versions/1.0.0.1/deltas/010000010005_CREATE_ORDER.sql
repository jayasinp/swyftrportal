CREATE TABLE `ORDER` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `order_address` TEXT NULL DEFAULT NULL,
  `customer` BIGINT(20) NULL,
  `delivery_required` TINYINT(1) NULL DEFAULT 0,
  `rider` INT NULL DEFAULT NULL,
  `order_date` BIGINT(20) NULL,
  `status` enum('INIT','ACCP','DISPATCH','DELI'),
  PRIMARY KEY (`id`),
  INDEX `fk_ORDER_1_idx` (`customer` ASC),
  INDEX `fk_ORDER_2_idx` (`rider` ASC),
  CONSTRAINT `fk_ORDER_1`
    FOREIGN KEY (`customer`)
    REFERENCES `PROFILE` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ORDER_2`
    FOREIGN KEY (`rider`)
    REFERENCES `RIDER_INFO` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION) ENGINE=InnoDB;

