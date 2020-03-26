export class OrderType {

  constructor();
  constructor(
    public orderId?: number,
    public deliveryAddress?: string,
    public customerId?: number,
    public deliveryRequired?: boolean,
    public riderId?: number,
    public orderDate?: number,
    public orgId?: string,
    public status?: string,
    public branchId?: number,
    public cusName?: string,
    public orgName?: string,
    public branchName?: string,
    public riderName?: string,
    public latitude?: number,
    public longitude?: number,
    public products?: Array<string>,
    public bLatitude?: number,
    public bLongitude?: number,
    public qrImageId?: number,
    public deliveryDate?: number
  ) {}

}

export class OrderInfo {
  constructor ();
  constructor (
    public items?: Array<OrderItem>,
    public customer?: OrderClient,
    public rider?: OrderRider
  ) {}
}

export class OrderRider {
  constructor();
  constructor (
    public firstName?: string,
    public lastName?: string,
    public mobile?: string,
    public vehicleNo?: string,
    public riderId?: string
  ) {}
}

export class OrderClient {
  constructor ();
  constructor (
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public mobileNo?: string,
    public phoneNo?: string,
    public address?: string
  ) {}
}

export class OrderItem {
  constructor ();
  constructor (
    public prodId?: number,
    public productName?: string,
    public unitPrice?: number,
    public categoryId?: number,
    public description?: string,
    public discount?: number,
    public sftrDiscount?: number,
    public availability?: string,
    public quantity?: number,
    public prodImageId?: number
  ) {}
}

export class RiderManagerOrder {
  constructor ();
  constructor (
    public orderId?: number,
    public deliveryAddress?: string,
    public customerId?: number,
    public deliveryRequired?: boolean,
    public riderId?: number,
    public orderDate?: number,
    public orgId?: string,
    public status?: string,
    public riderStatus?: string,
    public branchId?: number,
    public cusName?: string,
    public orgName?: string,
    public branchName?: string,
    public riderName?: string,
    public latitude?: number,
    public longitude?: number,
    public products?: Array<string>,
    public bLatitude?: number,
    public bLongitude?: number,
    public qrImageId?: number,
    public cusMobile?: string,
    public riderMobile?: string,
    public riderPicked?: boolean,
    public customerPicked?: boolean,
    public riderViewed?: boolean
  ) {}
}
