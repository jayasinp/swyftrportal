// Mysql constants
export const MYSQL_CONN_POOL_GENERAL = "MYSQL_CONN_POOL_GENERAL";
export const MYSQL_CONN_POOL_VIP = "MYSQL_CONN_POOL_VIP";
export const TRANSACTION_QUERY_COUNT_THRESHOLD = 5;
export const MYSQL_PRIMARY_KEY_VIOLATION = 1452;

// REST constants
export const CONTENT_TYPE = 'content-type';
export const X_KEY = 'x-key';
export const X_ACCESS_TOKEN = 'x-access-token';

export const APPLICATION_JSON = 'application/json';

// HTTP status codes
export const SUCCESS = 200;
export const INTERNAL_ERROR = 500;
export const ERROR_BUT_CONTINUE = 502;
export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_ACCEPTABLE = 406;
export const PRECONDITION_REQUIRED = 428;

// Miscellaneous constants
export const ONE_SECOND = 1000;

export const USER_TYPE = {
  RIDER: "rider",
  CUSTOMER: "customer",
  PARTNER: "partner",
  SWYFTR: "swyftr"
};

export const ORDER_STATUS = {
  NEW: 'INIT',
  ACCEPTED: 'ACCP',
  DISPATCHED: 'DISPATCH',
  DELIVERED: 'DELI',
  CANCELED: 'CANCELED',
  READY_TO_PICKUP: 'READY_TO_PICKUP'
}

export const VALID_ORDER_STATUS = ['INIT', 'ACCP', 'DISPATCH', 'DELI', 'CANCELED', 'READY_TO_PICKUP'];

export const ORDER_STATUS_DESC = {
  INIT: 'initialized',
  ACCP: 'accepted',
  DISPATCH: 'dispatched',
  DELI: 'delivered',
  CANCELED: 'canceled',
  READY_TO_PICKUP: 'waiting for the rider to pickup'
}

export const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
export const SL_PHONE_REGEX = /\d{10}/;
export const SL_NIC_REGEX = /\d{9}[V|v]$/;

export const DEFAULT_PWD_LENGTH = 256;
export const RANDOM_PWD_LENGTH = 8;
export const TWO = 2;
export const TOKEN_VALID_PERIOD_MS = 86400000;
export const HEX = "hex";
export const ORDER_DELETE_TIME_PERIOD_THRESHOLD = 172800000;

export const ALLOWED_USER_TYPES = [
  'rider', 'partner', 'swyftr'
];

export const ALLOWED_ORG_TYPES = [
  'swyftr', 'partner_store', 'partner_rider', 'partner_supplier'
];

export const PARTNER_STORE_TYPE = 'partner_store';
export const PARTNER_SWYFTER_TYPE = 'swyftr';
export const PARTNER_SUPPLIER_TYPE = 'partner_supplier';
export const PARTNER_RIDER_TYPE = 'partner_rider';

export const ALLOWED_PAYMENT_METHODS = [
  'cash', 'cheque'
];

export const NOTIFICATION_COLLAPSE_KEYS = {
  ORDER_STATUS: 'order status update'
}

export const NOT_FOUND_INDEX = -1;

export const RESET_PWD_TOKEN_LENGTH = 40;
export const CUSTOMER_RESET_PWD_TOKEN_LENGTH = 8;

export const PERMISSIONS = {
  GRANT_PERMISSIONS: 1,
  SWYFTR_SUPER_USER: 10001,
  MANAGE_PARTNERS: 2,
  VIEW_PARTNERS: 3,
  MANAGE_USERS: 4,
  VIEW_USERS: 5,
  RIDER_PARTNER_LOGIN: 6,
  MANAGE_ORDERS: 7,
  DEACTIVATE_USERS: 8,
  MANAGE_CUSTOMERS: 9,
  DEACTIVATE_CUSTOMERS: 10,
  ASSIGN_RIDERS_TO_ORDERS: 11,
  STORE_MANAGER_PRODUCT: 12
}

export const ASYNC_LIMIT = 5;

export const SWYFTER_ORG_ID = 1;

export const RESET_PWD_USER_TYPES = {
  SYS_USER: 'sys',
  CUSTOMER: 'cus'
}

export const RESET_PASSWORD_TOKEN_VALID_MILL_SECONDS = 18000000;

export const QR_SALT_LENGTH = 64;

export const RIDER_STATUS = {
  OFFLINE: 'OFFLINE',
  AVAILABLE: 'AVAILABLE',
  ON_DELIVERY: 'ON_DELIVERY',
  DELIVERY_ACCEPTED: 'DELIVERY_ACCEPTED',
  ASSIGNED: 'ASSIGNED'
}

export const LIVE_LOCATION_COLLECTION = 'live_location';

export const LIVE_LOCATION_ATTRIBUTES = {
  TIME: 'time',
  RIDER_ID: 'rider_id',
  LOCATION: 'location',
  LOCATION_LAT: 'latitude',
  LOCATION_LANG: 'longitude'
}

export const FIRE_QUERY_OPERATORS = {
  EQ: '==',
  GEQ: '>='
  // TODO other operators
}

export const RIDER_LIVE_LOCATION_ONLINE_TIME_GAP = 3000000

export const RIDER_SELECTION_DISTANCE = {
  KM5 : 5000,
  KM8 : 8000,
  KM10 : 1000000,
}

export const KM3 = 3000

export const MAX_ORDERS_PER_RIDER = 4

export const TIME_GAP_TO_DETERMIN_ORDER_IS_SCHEDULED = 7200000

export const PARAM = {
  OTP_RETRY_COUNT: "OTP_RETRY_COUNT"
}

export const OTP_MESSAGE = "Please use this one time password for registering with Swyftr :"
