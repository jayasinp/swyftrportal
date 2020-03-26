LOCK TABLES `PERMISSION_TYPES` WRITE;
/*!40000 ALTER TABLE `PERMISSION_TYPES` DISABLE KEYS */;
INSERT INTO `PERMISSION_TYPES` VALUES (1,'GRANT_PERMISSIONS','Can grant and revoke permissions to and from other users'),(2,'MANAGE_PARTNERS','Can add, update, remove and view partner details'),(3,'VIEW_PARTNERS','Can only view partner details'),(4,'MANAGE_USERS','Can add, update, remove users of your organization'),(5,'VIEW_USERS','Can only view users under your organization'),(6,'RIDER_PARTNER_LOGIN','Can login to admin portal'),(10001,'SUPER_USER_SWYFTR','Super user of Swyftr');
/*!40000 ALTER TABLE `PERMISSION_TYPES` ENABLE KEYS */;
UNLOCK TABLES;
INSERT INTO `SYS_USER_PROFILE` (`user_id`, `first_name`, `last_name`, `dob`,`email`,`mobile_no`,`nic`,`address`) 
VALUES ('1', 'Shermin', 'Fernando','01-01-1980','aa@swiftr.com','0771155578','911546788V','Colombo');

/*Setting password as '123'*/;
INSERT INTO `SYS_AUTH`
(`password`,
`salt`,
`active`,
`sys_user_id`)
VALUES
('bdf32ddee53ed7146301f736ca6114295192f53c551352919c8f92412ba6682b',
'f7762276002644689c7ba355311a20fbe3b1b19ce0c87f066122b8fd00441636683d6dbee8f292bae3b187fd3d1009b8aa9172abde518c2fd33cd41e90bafb3cca1008536dea92e99d8eebc24363500ddb8505615ff29f22592c00c7b0ca4027f43970ba13bfe3e30b6dd380cde52576935b269fbd085103e6ca6b48108f8e6b',
1,
1);

INSERT INTO `USER_PERMISSIONS` (`user_id`, `permission_id`, `added_date`, `revoked`) VALUES (1, 10001, '1517382012143', 0);