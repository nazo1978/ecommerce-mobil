import { CalendarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const auctionType = defineType({
  name: 'auction',
  title: 'Auction',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seller',
      title: 'Seller',
      type: 'reference',
      to: [{ type: 'user' }],
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
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'reservePrice',
      title: 'Reserve Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'buyNowPrice',
      title: 'Buy Now Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'Turkish Lira (TRY)', value: 'TRY' },
          { title: 'US Dollar (USD)', value: 'USD' },
          { title: 'Euro (EUR)', value: 'EUR' },
        ],
      },
      initialValue: 'TRY',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Active', value: 'active' },
          { title: 'Ended', value: 'ended' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bidIncrement',
      title: 'Bid Increment',
      type: 'number',
      validation: (Rule) => Rule.required().min(0.01),
    }),
    defineField({
      name: 'totalBids',
      title: 'Total Bids',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'highestBidder',
      title: 'Highest Bidder',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'isReserveMet',
      title: 'Is Reserve Met',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'autoExtend',
      title: 'Auto Extend',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'extendMinutes',
      title: 'Extend Minutes',
      type: 'number',
      validation: (Rule) => Rule.min(1),
      initialValue: 5,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'currentPrice',
      media: 'product.images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title,
        subtitle: subtitle ? `Current: ${subtitle} TRY` : 'No bids yet',
        media,
      }
    },
  },
})
