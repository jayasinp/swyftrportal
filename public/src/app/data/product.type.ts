export class ProductType {
    constructor();
    constructor(
      public id?: number,
      public productName?: string,
      public productCode?: string,
      public quantity?: number,
      public unitPrice?: number,
      public branchId?: number,
   public branchName?: string,
      public categoryId?: string,
      public description?: string,
      public discount?: number,
 public sftrDiscount?: number,
      public availability?: string,
      public specialNote?: string,
      public imageId?: number,
      public assetIds?: any[],
      public isAvailable?: boolean,
      public tags?: string
    ) {}
  }


export class ProductTypeAvalab {
    constructor();
    constructor(
      public availability?: string,
      public id?: number,
      public productName?: string,
      public productCode?: string,
      public branchId?: number,
      public categoryId?: string,
     
     
    ) {}
  }

