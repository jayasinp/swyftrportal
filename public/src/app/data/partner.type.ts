export class PartnerType {
  constructor();
  constructor(
    public orgId?: number,
    public name?: string,
    public headOfficeAddress?: string,
    public headOfficeContactNo?: string,
    public orgType?: string, // To be used as index type
    public bank?: string,
    public branch?: string,
    public accountNo?: string,
    public preferedPaymentMethod?: string,
    public branchCode?: string,
    public bankSwiftCode?: string,
    public pointOfContactName?: string,
    public pointOfContactMobile?: string,
    public logoId?: number,
    public tags?: string
  ) {}
}
