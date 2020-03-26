export class UserType {
  constructor();
  constructor(
    public userId?: number,
    public firstName?: string,
    public lastName?: string,
    public dateOfBirth?: number,
    public email?: string,
    public phoneNumber?: string,
    public mobileNumber?: string,
    public nic?: string,
    public addressList?: Array<UserAddress>,
    public profilePicId?: number
  ) {}
}

export class SysUserType {
  constructor();
  constructor(
    public userId?: number,
    public firstName?: string,
    public lastName?: string,
    public dateOfBirth?: number,
    public email?: string,
    public phoneNumber?: string,
    public mobileNumber?: string,
    public nic?: string,
    public address?: string,
    public orgId?: number,
    public designation?: string,
    public userType?: string,
    public orgName?: string,
    public profilePicId?: number,
    public branchId?: number
  ) {}
}


export class UserAddress {
  constructor();
  constructor(
    public number?: string,
    public addressLine1?: string,
    public addressLine2?: string,
    public district?: string,
    public province?: string,
    public id?: string
  ) {}
}

export class UpdatePasswordType {
  constructor();
  constructor(
    public newPassword?: string,
    public retypePassword?: string,
    public oldPassword?: string
  ) {}
}

export class RiderType extends SysUserType {
  constructor();
  constructor(
    public userId?: number,
    public firstName?: string,
    public lastName?: string,
    public dateOfBirth?: number,
    public email?: string,
    public phoneNumber?: string,
    public mobileNumber?: string,
    public nic?: string,
    public address?: string,
    public orgId?: number,
    public designation?: string,
    public userType?: string,
    public orgName?: string,
    public profilePicId?: number,
    public license?: string,
    public vehicalNo?: string,
    public status?: string
  ) {
    super();
  }
}

export class RiderLocationType {
  constructor();
  constructor(
    public location?: FireStoreLocationType,
    public rider_id?: string,
    public time?: number,
    public status?: string,
    public name?: string,
    public mobile?: string
  ) {}
}

export class FireStoreLocationType {
  constructor();
  constructor(
    public _lat?: number,
    public _long?: number
  ) {}
}

export class RiderGeoLocationType {
  constructor();
  constructor(
    public latitude?: number,
    public longitude?: number
  ) {}
}

export class RiderWithLocation extends RiderType {
  constructor();
  constructor(
    public currentLocation?: RiderGeoLocationType,
    public distanceToOrderPickup?: number
  ) {
    super();
  }
}
