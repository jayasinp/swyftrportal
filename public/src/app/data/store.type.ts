export class StoreType {

  constructor();
  constructor(
    public id?: number,
    public orgId?: number,
    public onlineStatus?: boolean,
    public branchName?: string,
    public address?: string,
    public longitude?: number,
    public latitude?: number,
    public district?: string,
    public province?: string,
    public managerId?: number,
    public phone?: string,
    public orgName?: string,
    public partnerTags?: string
  ) {}

}

export class OnlineStatusRequestType {
  constructor();
  constructor(
    public onlineStatus?: boolean,
    public id?: number
  ) {}
}
