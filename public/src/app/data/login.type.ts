export class LoginResponseType {
  constructor();
  constructor(
    public status?: number,
    public accessToken?: string,
    public refreshToken?: string,
    public userId?: string,
    public timeToLiveInMilliSeconds?: string
  ) {}
}


export class LoginRequestType {
  constructor();
  constructor(
    public userName?: string,
    public password?: string
  ) {}
}

export class UserToken {
  constructor();
  constructor(
    public email?: string,
    public token?: string,
    public loginAt?: number,
    public ttl?: number
  ) {}
}
