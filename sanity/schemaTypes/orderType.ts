import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
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
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'total',
              title: 'Total',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'tax',
      title: 'Tax',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'discount',
      title: 'Discount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'street',
          title: 'Street',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
        }),
        defineField({
          name: 'zipCode',
          title: 'Zip Code',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
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
      title: 'orderNumber',
      subtitle: 'total',
      media: 'items.0.product.images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'No order number',
        subtitle: subtitle ? `${subtitle} TRY` : 'No total',
        media,
      }
    },
  },
})
