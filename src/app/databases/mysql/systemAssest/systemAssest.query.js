export const INSERT_FILE = 'INSERT INTO `SYSTEM_ASSETS`' +
  '(`file_name`,' +
  '`given_name`,' +
  '`description`,' +
  '`file_type`,' +
  '`file_size`,' +
  '`file`,' +
  '`added_date`)' +
  'VALUES' +
  '(?, ?, ?, ?, ?, ?, ?);'

export const GET_FILE_BY_ID = 'SELECT * FROM SYSTEM_ASSETS WHERE id=?';

export const GET_FILE_BY_IDS = 'SELECT * FROM SYSTEM_ASSETS WHERE id IN (?)';
