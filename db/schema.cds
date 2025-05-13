using { cuid, managed } from '@sap/cds/common';

namespace my.bookshop;

@odata.draft.enabled
entity Category: cuid, managed {
  name: String;
  description: String;
}
@odata.draft.enabled
entity Books: cuid, managed {  
  title: String;
  description: String;
  author: String;
  datePub: Date;
  stock: Integer;
  category: Association to Category;
}


entity Interest: cuid, managed {
  customer: Association to Customers;
  category: Association to Category @Common.Text: category.name;
}

@odata.draft.enabled
entity Customers: cuid, managed {
  name: String;
  dateNasc: Date;
  cpf: String;
  interest : Composition of many Interest on interest.customer = $self;
}

