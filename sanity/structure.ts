import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('E-Commerce Platform')
    .items([
      // Products section
      S.listItem()
        .title('Products')
        .child(
          S.list()
            .title('Products')
            .items([
              S.documentTypeListItem('product').title('All Products'),
              S.listItem()
                .title('Active Products')
                .child(
                  S.documentList()
                    .title('Active Products')
                    .filter('_type == "product" && isActive == true')
                ),
              S.listItem()
                .title('Featured Products')
                .child(
                  S.documentList()
                    .title('Featured Products')
                    .filter('_type == "product" && isFeatured == true')
                ),
            ])
        ),

      // Categories
      S.documentTypeListItem('category').title('Categories'),

      // Auctions section
      S.listItem()
        .title('Auctions')
        .child(
          S.list()
            .title('Auctions')
            .items([
              S.documentTypeListItem('auction').title('All Auctions'),
              S.listItem()
                .title('Active Auctions')
                .child(
                  S.documentList()
                    .title('Active Auctions')
                    .filter('_type == "auction" && status == "active"')
                ),
              S.listItem()
                .title('Upcoming Auctions')
                .child(
                  S.documentList()
                    .title('Upcoming Auctions')
                    .filter('_type == "auction" && status == "scheduled"')
                ),
              S.documentTypeListItem('bid').title('Bids'),
            ])
        ),

      // Orders
      S.listItem()
        .title('Orders')
        .child(
          S.list()
            .title('Orders')
            .items([
              S.documentTypeListItem('order').title('All Orders'),
              S.listItem()
                .title('Pending Orders')
                .child(
                  S.documentList()
                    .title('Pending Orders')
                    .filter('_type == "order" && status == "pending"')
                ),
              S.listItem()
                .title('Confirmed Orders')
                .child(
                  S.documentList()
                    .title('Confirmed Orders')
                    .filter('_type == "order" && status == "confirmed"')
                ),
            ])
        ),

      // Users
      S.documentTypeListItem('user').title('Users'),

      S.divider(),

      // Other document types
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['product', 'category', 'auction', 'bid', 'order', 'user'].includes(item.getId()!),
      ),
    ])
