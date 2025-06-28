import { defineField, defineType } from 'sanity';

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Compare Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'costPrice',
      title: 'Cost Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'minStock',
      title: 'Minimum Stock',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        { name: 'length', title: 'Length', type: 'number' },
        { name: 'width', title: 'Width', type: 'number' },
        { name: 'height', title: 'Height', type: 'number' },
        {
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              { title: 'Centimeters', value: 'cm' },
              { title: 'Inches', value: 'in' },
            ],
          },
          initialValue: 'cm',
        },
      ],
    }),
    defineField({
      name: 'vendor',
      title: 'Vendor',
      type: 'reference',
      to: [{ type: 'vendor' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'position', title: 'Position', type: 'number' },
            { name: 'isMain', title: 'Is Main Image', type: 'boolean', initialValue: false },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'url', title: 'Video URL', type: 'url' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'position', title: 'Position', type: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isPublished',
      title: 'Is Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isDigital',
      title: 'Is Digital',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hasVariants',
      title: 'Has Variants',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'sku', title: 'SKU', type: 'string' },
            { name: 'price', title: 'Price', type: 'number' },
            { name: 'stock', title: 'Stock', type: 'number' },
            { name: 'image', title: 'Image', type: 'image' },
            {
              name: 'attributes',
              title: 'Attributes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'value', title: 'Value', type: 'string' },
                  ],
                },
              ],
            },
            { name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true },
          ],
        },
      ],
    }),
    defineField({
      name: 'requiresShipping',
      title: 'Requires Shipping',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shippingClass',
      title: 'Shipping Class',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'salesCount',
      title: 'Sales Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'images.0.image',
    },
  },
});
