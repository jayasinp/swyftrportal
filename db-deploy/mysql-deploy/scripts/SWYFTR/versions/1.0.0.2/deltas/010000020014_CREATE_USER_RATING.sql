CREATE TABLE `USER_RATING` (
  `order_id` BIGINT(20) NOT NULL,
  `user_id` INT NOT NULL,
  `user_type` VARCHAR(45) NOT NULL,
  `customer_rating` INT NULL,
  `rider_rating` INT NULL,
  `store_rating` INT NULL,
  `swyftr_rating` INT NULL,
  PRIMARY KEY (`order_id`, `user_id`, `user_type`));