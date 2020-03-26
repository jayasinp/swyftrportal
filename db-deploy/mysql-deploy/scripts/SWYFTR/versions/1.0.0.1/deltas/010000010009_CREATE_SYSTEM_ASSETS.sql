CREATE TABLE IF NOT EXISTS `SYSTEM_ASSETS` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(100) NOT NULL,
  `given_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `file_type` ENUM('pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx') NOT NULL,
  `file_size` VARCHAR(45) NULL,
  `file` BLOB NOT NULL,
  `added_date` BIGINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB