import { userSchema } from './user';
import { productSchema } from './product';
import { categorySchema } from './category';
import { vendorSchema } from './vendor';
import { auctionSchema, auctionBidSchema, auctionWatcherSchema } from './auction';

export const schemaTypes = [
  userSchema,
  productSchema,
  categorySchema,
  vendorSchema,
  auctionSchema,
  auctionBidSchema,
  auctionWatcherSchema,
];
