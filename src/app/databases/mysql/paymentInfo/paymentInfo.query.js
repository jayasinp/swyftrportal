export const INSERT_PAYMENT_INFO = "INSERT INTO `PAYMENT_INFO`"+
  "(`order_id`,"+
  "`transaction_id`,"+
  "`total_amount`,"+
  "`email`,"+
  "`contact_number`,"+
  "`delivery_address`," +
  "`status`, "+
  "`rider_id`) "+
"VALUES"+
"(?);";
