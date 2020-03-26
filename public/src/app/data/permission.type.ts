export class Permission {

  constructor();
  constructor(
    public id?: number,
    public name?: String,
    public description?: String
  ) {}

}

export class PermissionItem {

  constructor();
  constructor(
    public permissionId?: number,
    public allowed?: Boolean
  ) {}

}
