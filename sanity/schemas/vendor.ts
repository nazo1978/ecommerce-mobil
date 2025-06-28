import { defineField, defineType } from 'sanity';

export const vendorSchema = defineType({
  name: 'vendor',
  title: 'Vendor',
  type: 'document',
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'storeDescription',
      title: 'Store Description',
      type: 'text',
    }),
    defineField({
      name: 'storeSlug',
      title: 'Store Slug',
      type: 'slug',
      options: {
        source: 'storeName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'banner',
      title: 'Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      fields: [
        { name: 'companyName', title: 'Company Name', type: 'string' },
        { name: 'taxNumber', title: 'Tax Number', type: 'string' },
        { name: 'taxOffice', title: 'Tax Office', type: 'string' },
        { name: 'businessType', title: 'Business Type', type: 'string' },
        { name: 'registrationNumber', title: 'Registration Number', type: 'string' },
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'website', title: 'Website', type: 'url' },
        { name: 'address', title: 'Address', type: 'text' },
      ],
    }),
    defineField({
      name: 'bankInfo',
      title: 'Bank Information',
      type: 'object',
      fields: [
        { name: 'bankName', title: 'Bank Name', type: 'string' },
        { name: 'accountNumber', title: 'Account Number', type: 'string' },
        { name: 'iban', title: 'IBAN', type: 'string' },
        { name: 'accountHolder', title: 'Account Holder', type: 'string' },
      ],
    }),
    defineField({
      name: 'commissionRate',
      title: 'Commission Rate (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 10,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isVerified',
      title: 'Is Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationStatus',
      title: 'Verification Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Under Review', value: 'under_review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
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
    defineField({
      name: 'totalSales',
      title: 'Total Sales',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'totalEarnings',
      title: 'Total Earnings',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'joinedAt',
      title: 'Joined At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'verifiedAt',
      title: 'Verified At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'storeName',
      subtitle: 'user.email',
      media: 'logo',
    },
  },
});
