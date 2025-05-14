using { cuid, managed } from '@sap/cds/common';

namespace my.bookshop;


entity Category: cuid, managed {
  name: String not null;
  description: String;
}

entity Books: cuid, managed {  
  title: String not null;
  description: String;
  author: String not null;
  datePub: Date not null;
  stock: Integer not null;
  category: Association to Category not null;
}

entity Interest: cuid, managed {
  customer: Association to Customers;
  category: Association to Category @Common.Text: category.name;

}


entity Customers: cuid, managed {
  name: String not null;
  dateNasc: Date not null;
  cpf: String not null;
  interest : Composition of many Interest on interest.customer = $self;
}

