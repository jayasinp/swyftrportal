export const INSERT_FILE = 'INSERT INTO `PROFILE_ASSEST`' +
  '(`assest_type`,' +
  '`file`,' +
  '`added_date`,' +
  '`file_name`)' +
  'VALUES' +
  '(?, ?, ?, ?)'

export const GET_FILE_BY_ID = 'SELECT * FROM PROFILE_ASSEST WHERE id=?';
