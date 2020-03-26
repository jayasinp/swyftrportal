import {HttpHeaders} from '@angular/common/http';
import {FileUploader} from 'ng2-file-upload';

export const DEV_HOST = 'localhost:7788';
export const PROD_HOST = '52.220.138.167';

const HOST = PROD_HOST;

export const getEndpoint = (isHttps) => {
  isHttps = false; // TODO DEV ONLY TILL andorid finished
  return `${isHttps ? 'https' : 'http'}://${HOST}/api/v1`;
};

export const prepareHeaders = () => {
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    const auth = session['auth'];
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('x-username', auth['email']);
    headers = headers.set('x-token', auth['token']);
    return {
      headers: headers
    };
  } catch (er) {
    console.log(er);
    return null;
  }
};  

export const getAuthObject = () => {
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    return session['auth'];
  } catch (er) {
    console.log(er);
    return null;
  }
};

export const SYS_USER_TYPE = [
  { name: 'Rider Employee', type: 'rider'},
  { name: 'Swyftr Employee', type: 'swyftr'},
  { name: 'Store Partner Employee', type: 'partner'}
];

export const PARTNER_NAME_TO_TYPE = {
  'swyftr': 'Swyfter',
  'partner_store': 'Store Partner',
  'partner_rider': 'Rider Provider',
  'partner_supplier': 'Supplier Partner'
};

export const PARTNER_TYPES = [
  { name: 'Store Partner', type: 'partner_store'},
  { name: 'Rider Provider', type: 'partner_rider'},
  { name: 'Supplier Partner', type: 'partner_supplier'},
];

export const PREFERED_PAYMENT_TYPES = [
  { text: 'Cash', id: 'cash'},
  { text: 'Cheque', id: 'cheque'},
  { text: 'Bank Transfers', id: 'online_transfers'}
];

export const beautifyUnderscoreConcatinatedString = function (word) {
  return word.replace(/_/g, ' ');
};

export const  ORDER_STATUS_DESC = {
  INIT: 'New',
  ACCP: 'Accepted',
  DISPATCH: 'Dispatched',
  DELI: 'Delivered',
  CANCELED: 'Canceled',
  READY_TO_PICKUP: 'Ready To Pickup'
};

export const ORDER_STATUS = {
  INIT: 'INIT',
  ACCP: 'ACCP',
  DISPATCH: 'DISPATCH',
  DELI: 'DELI',
  CANCELED: 'CANCELED',
  READY_TO_PICKUP: 'READY_TO_PICKUP'
};

export const GOOGLE_API_KEY = 'AIzaSyDRGD0976WvRK7HML3OlUnJn1C7J6vA7W0';

export const bin2string = (array) => {
  let result = '';
  for (let i = 0; i < array.length; ++i) {
    result += (String.fromCharCode(array[i]));
  }
  return btoa(result);
};

export const prepareFileUploader = (onCompleteCallback, beforeUpload) => {
  const auth = getAuthObject();
  const fileUploader = new FileUploader({
    url: `${getEndpoint(true)}/file/sys/upload`,
    autoUpload: true,
    method: 'POST',
    itemAlias: 'fileToUpload',
    headers: [
      {name: 'x-username', value: auth['email']},
      {name: 'x-token', value: auth['token']}
    ]
  });
  fileUploader.onAfterAddingFile = (item) => {
    item.withCredentials = false;
    beforeUpload(item);
  };
  fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    return onCompleteCallback(item, response, status, headers);
  };
  return fileUploader;
};


export const RIDER_STATUS = {
  'OFFLINE': 'Offline',
  'AVAILABLE': 'Available',
  'ON_DELIVERY': 'On Delivery',
  'DELIVERY_ACCEPTED': 'Delivery Accepted',
  'ASSIGNED': 'Assigned'
};

export const MAX_SCHEDULE_TIME = 24 * 60 * 60 * 1000;
export const MIN_SCHEDULE_TIME = 2 * 60 * 60 * 1000;
