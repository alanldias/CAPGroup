using { cuid, managed } from '@sap/cds/common';

namespace my.bookshop;

entity Books: cuid, managed {  
  title: String;
  author: String;
  stock: Integer;
}
