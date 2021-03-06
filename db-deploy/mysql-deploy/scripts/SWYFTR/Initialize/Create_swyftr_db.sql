CREATE DATABASE IF NOT EXISTS `SWYFTR` DEFAULT CHARACTER SET utf8;

USE `SWYFTR`;

CREATE TABLE IF NOT EXISTS changelog (
  change_number BIGINT NOT NULL,
  complete_dt TIMESTAMP NOT NULL,
  applied_by VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
CONSTRAINT Pkchangelog PRIMARY KEY (change_number)
);

