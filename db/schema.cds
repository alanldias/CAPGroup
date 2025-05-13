using { cuid, managed } from '@sap/cds/common';

namespace my.bookshop;

@odata.draft.enabled
entity Category: cuid, managed {
  name: String not null;
  description: String;
}
@odata.draft.enabled
entity Books: cuid, managed {  
  title: String not null;
  description: String;
  author: String not null;
  datePub: Date not null;
  stock: Integer;
  category: Association to Category not null;
}

entity Interest: cuid, managed {
  customer: Association to Customers;
  category: Association to Category @Common.Text: category.name;

}

@odata.draft.enabled
entity Customers: cuid, managed {
  name: String not null;
  dateNasc: Date not null;
  cpf: String not null;
  interest : Composition of many Interest on interest.customer = $self;
}

