ALTER TABLE `PROFILE`
ADD COLUMN `device_os` ENUM('ios', 'android') NULL AFTER `device_id`;