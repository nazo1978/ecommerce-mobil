import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'E-commerce Platform',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Users')
              .child(S.documentTypeList('user').title('Users')),
            S.listItem()
              .title('Products')
              .child(S.documentTypeList('product').title('Products')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Vendors')
              .child(S.documentTypeList('vendor').title('Vendors')),
            S.divider(),
            S.listItem()
              .title('Auctions')
              .child(
                S.list()
                  .title('Auction Management')
                  .items([
                    S.listItem()
                      .title('Auctions')
                      .child(S.documentTypeList('auction').title('Auctions')),
                    S.listItem()
                      .title('Bids')
                      .child(S.documentTypeList('auctionBid').title('Bids')),
                    S.listItem()
                      .title('Watchers')
                      .child(S.documentTypeList('auctionWatcher').title('Watchers')),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
