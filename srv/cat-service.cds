using my.bookshop as my from '../db/schema';

service CatalogService {
     entity Books as projection on my.Books {
    *,
    category};
    entity Category as projection on my.Category;
    entity Customers as projection on my.Customers;
    entity Interest as projection on my.Interest;
}
 