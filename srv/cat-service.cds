using my.bookshop as my from '../db/schema';

service CatalogService {
    @odata.draft.enabled
     entity Books as projection on my.Books {
    *,
    category};

    entity BooksNoDraft as projection on my.Books {
    *,
    category
  };
    @odata.draft.enabled
    entity Category as projection on my.Category;
    @odata.draft.enabled
    entity Customers as projection on my.Customers;
    entity Interest as projection on my.Interest;
}
