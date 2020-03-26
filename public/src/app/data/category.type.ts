export class CategoryType {
    constructor();
    constructor(
      public id?: string,
      public categoryName?: string,
      public parentCategory?: string
    ) {}
  }