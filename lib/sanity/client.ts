import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

// GROQ queries
export const GROQ_QUERIES = {
  // User queries
  GET_USER_BY_EMAIL: `*[_type == "user" && email == $email][0]`,
  GET_USER_BY_ID: `*[_type == "user" && id == $id][0]`,
  GET_USERS: `*[_type == "user" && isActive == true] | order(createdAt desc)`,

  // Product queries
  GET_PRODUCTS: `*[_type == "product" && isActive == true] | order(createdAt desc){
    ...,
    seller->,
    category->
  }`,
  GET_PRODUCT_BY_SLUG: `*[_type == "product" && slug.current == $slug && isActive == true][0]{
    ...,
    seller->,
    category->
  }`,
  GET_PRODUCT_BY_ID: `*[_type == "product" && id == $id][0]{
    ...,
    seller->,
    category->
  }`,
  GET_PRODUCTS_BY_CATEGORY: `*[_type == "product" && category._ref == $categoryId && isActive == true] | order(createdAt desc)`,
  GET_PRODUCTS_BY_SELLER: `*[_type == "product" && seller._ref == $sellerId && isActive == true] | order(createdAt desc)`,
  GET_FEATURED_PRODUCTS: `*[_type == "product" && isActive == true && isFeatured == true] | order(createdAt desc)`,

  // Category queries
  GET_CATEGORIES: `*[_type == "category" && isActive == true] | order(sortOrder asc)`,
  GET_CATEGORY_BY_SLUG: `*[_type == "category" && slug.current == $slug && isActive == true][0]`,
  GET_CATEGORY_BY_ID: `*[_type == "category" && id == $id][0]`,
  GET_ROOT_CATEGORIES: `*[_type == "category" && isActive == true && !defined(parentCategory)] | order(sortOrder asc)`,
  GET_SUBCATEGORIES: `*[_type == "category" && parentCategory._ref == $parentId && isActive == true] | order(sortOrder asc)`,

  // Auction queries
  GET_AUCTIONS: `*[_type == "auction"] | order(startTime desc){
    ...,
    product->,
    seller->,
    highestBidder->,
    winner->
  }`,
  GET_AUCTION_BY_ID: `*[_type == "auction" && id == $id][0]{
    ...,
    product->,
    seller->,
    highestBidder->,
    winner->
  }`,
  GET_ACTIVE_AUCTIONS: `*[_type == "auction" && status == "active"] | order(endTime asc)`,
  GET_UPCOMING_AUCTIONS: `*[_type == "auction" && status == "scheduled"] | order(startTime asc)`,
  GET_ENDED_AUCTIONS: `*[_type == "auction" && status == "ended"] | order(endTime desc)`,

  // Bid queries
  GET_AUCTION_BIDS: `*[_type == "bid" && auction._ref == $auctionId] | order(createdAt desc){
    ...,
    bidder->,
    auction->
  }`,
  GET_USER_BIDS: `*[_type == "bid" && bidder._ref == $userId] | order(createdAt desc){
    ...,
    auction->{
      ...,
      product->
    }
  }`,
  GET_WINNING_BIDS: `*[_type == "bid" && isWinning == true && bidder._ref == $userId]{
    ...,
    auction->{
      ...,
      product->
    }
  }`,

  // Order queries
  GET_ORDERS: `*[_type == "order"] | order(createdAt desc){
    ...,
    user->
  }`,
  GET_ORDER_BY_ID: `*[_type == "order" && id == $id][0]{
    ...,
    user->
  }`,
  GET_USER_ORDERS: `*[_type == "order" && user._ref == $userId] | order(createdAt desc)`,
  GET_ORDER_BY_NUMBER: `*[_type == "order" && orderNumber == $orderNumber][0]{
    ...,
    user->
  }`,
} as const;

// Helper functions for common operations
export const sanityHelpers = {
  // Create document
  create: async (doc: any) => {
    return await client.create(doc);
  },

  // Update document
  update: async (id: string, patch: any) => {
    return await client.patch(id).set(patch).commit();
  },

  // Delete document
  delete: async (id: string) => {
    return await client.delete(id);
  },

  // Fetch single document
  fetch: async (query: string, params?: any) => {
    return await client.fetch(query, params);
  },

  // Fetch multiple documents with pagination
  fetchPaginated: async (
    query: string,
    params: any = {},
    page: number = 1,
    limit: number = 20
  ) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginatedQuery = `${query}[${start}...${end}]`;
    const countQuery = `count(${query})`;
    
    const [data, total] = await Promise.all([
      client.fetch(paginatedQuery, params),
      client.fetch(countQuery, params),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: end < total,
      hasPrev: page > 1,
    };
  },

  // Upload image
  uploadImage: async (file: File) => {
    return await client.assets.upload('image', file);
  },

  // Generate unique slug
  generateSlug: async (type: string, source: string, id?: string) => {
    const baseSlug = source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await client.fetch(
        `*[_type == $type && slug.current == $slug && _id != $id][0]`,
        { type, slug, id }
      );
      
      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  },
};
