import { defineField, defineType } from 'sanity';

export const auctionSchema = defineType({
  name: 'auction',
  title: 'Auction',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vendor',
      title: 'Vendor',
      type: 'reference',
      to: [{ type: 'vendor' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currentPrice',
      title: 'Current Price',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'bidIncrement',
      title: 'Bid Increment',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 10,
    }),
    defineField({
      name: 'reservePrice',
      title: 'Reserve Price',
      type: 'number',
    }),
    defineField({
      name: 'buyNowPrice',
      title: 'Buy Now Price',
      type: 'number',
    }),
    defineField({
      name: 'startAt',
      title: 'Start At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endAt',
      title: 'End At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Live', value: 'live' },
          { title: 'Ended', value: 'ended' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'upcoming',
    }),
    defineField({
      name: 'autoExtend',
      title: 'Auto Extend',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'extensionTime',
      title: 'Extension Time (minutes)',
      type: 'number',
      initialValue: 5,
    }),
    defineField({
      name: 'maxExtensions',
      title: 'Max Extensions',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'currentExtensions',
      title: 'Current Extensions',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'bidCount',
      title: 'Bid Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'watcherCount',
      title: 'Watcher Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'winningBid',
      title: 'Winning Bid',
      type: 'reference',
      to: [{ type: 'auctionBid' }],
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'isPaid',
      title: 'Is Paid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'paymentDueAt',
      title: 'Payment Due At',
      type: 'datetime',
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'product.images.0.image',
    },
  },
});

export const auctionBidSchema = defineType({
  name: 'auctionBid',
  title: 'Auction Bid',
  type: 'document',
  fields: [
    defineField({
      name: 'auction',
      title: 'Auction',
      type: 'reference',
      to: [{ type: 'auction' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'isWinning',
      title: 'Is Winning',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isAutoBid',
      title: 'Is Auto Bid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'maxAmount',
      title: 'Max Amount',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'amount',
      subtitle: 'user.email',
      media: 'auction.product.images.0.image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: `₺${title}`,
        subtitle: `by ${subtitle}`,
        media,
      };
    },
  },
});

export const auctionWatcherSchema = defineType({
  name: 'auctionWatcher',
  title: 'Auction Watcher',
  type: 'document',
  fields: [
    defineField({
      name: 'auction',
      title: 'Auction',
      type: 'reference',
      to: [{ type: 'auction' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'user.email',
      subtitle: 'auction.title',
    },
  },
});
