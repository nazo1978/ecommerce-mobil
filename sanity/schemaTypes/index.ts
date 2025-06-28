import { type SchemaTypeDefinition } from 'sanity'

import { userType } from './userType'
import { categoryType } from './categoryType'
import { productType } from './productType'
import { auctionType } from './auctionType'
import { bidType } from './bidType'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, categoryType, productType, auctionType, bidType, orderType],
}
