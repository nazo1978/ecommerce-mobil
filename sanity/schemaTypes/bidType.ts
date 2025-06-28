import { CreditCardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const bidType = defineType({
  name: 'bid',
  title: 'Bid',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'auction',
      title: 'Auction',
      type: 'reference',
      to: [{ type: 'auction' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bidder',
      title: 'Bidder',
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
      name: 'maxAutoBid',
      title: 'Max Auto Bid',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'amount',
      subtitle: 'auction.title',
      media: 'auction.product.images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title ? `${title} TRY` : 'No amount',
        subtitle: subtitle || 'No auction',
        media,
      }
    },
  },
})
