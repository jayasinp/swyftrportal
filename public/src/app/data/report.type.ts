export class ReportType {
    constructor();
    constructor(
      public name?: string,
      public total?: number,
      public paymentPercentage?: number,
      public branchId?: number,
      public branchName?: string,
      public orgId?: string,
      public branchStockId?: string,
      public totalPrice?: number,
      public productName?: string
    ) {}
  }