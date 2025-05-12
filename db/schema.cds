using { cuid, managed } from '@sap/cds/common';

namespace my.bookshop;

entity Category: cuid, managed {
  name: String;
  description: String;
}
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
  category: Association to Category;
}

entity Customers: cuid, managed {
  name: String;
  dateNasc: Date;
  cpf: String;
  interest : Composition of many Interest on interest.customer = $self;
}

