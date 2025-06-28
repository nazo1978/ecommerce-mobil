import { defineField, defineType } from 'sanity';

export const userSchema = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Seller', value: 'seller' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'user',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isEmailVerified',
      title: 'Is Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isPhoneVerified',
      title: 'Is Phone Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'addresses',
      title: 'Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'firstName', title: 'First Name', type: 'string' },
            { name: 'lastName', title: 'Last Name', type: 'string' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'country', title: 'Country', type: 'string' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'district', title: 'District', type: 'string' },
            { name: 'address', title: 'Address', type: 'text' },
            { name: 'postalCode', title: 'Postal Code', type: 'string' },
            { name: 'isDefault', title: 'Is Default', type: 'boolean', initialValue: false },
          ],
        },
      ],
    }),
    defineField({
      name: 'referralCode',
      title: 'Referral Code',
      type: 'string',
    }),
    defineField({
      name: 'referredBy',
      title: 'Referred By',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'mlmLevel',
      title: 'MLM Level',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'totalEarnings',
      title: 'Total Earnings',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        { name: 'language', title: 'Language', type: 'string', initialValue: 'tr' },
        { name: 'currency', title: 'Currency', type: 'string', initialValue: 'TRY' },
        {
          name: 'notifications',
          title: 'Notifications',
          type: 'object',
          fields: [
            { name: 'email', title: 'Email', type: 'boolean', initialValue: true },
            { name: 'sms', title: 'SMS', type: 'boolean', initialValue: false },
            { name: 'push', title: 'Push', type: 'boolean', initialValue: true },
            { name: 'marketing', title: 'Marketing', type: 'boolean', initialValue: false },
          ],
        },
        {
          name: 'privacy',
          title: 'Privacy',
          type: 'object',
          fields: [
            { name: 'showProfile', title: 'Show Profile', type: 'boolean', initialValue: true },
            { name: 'showActivity', title: 'Show Activity', type: 'boolean', initialValue: false },
          ],
        },
      ],
    }),
    defineField({
      name: 'lastLoginAt',
      title: 'Last Login At',
      type: 'datetime',
    }),
    defineField({
      name: 'emailVerifiedAt',
      title: 'Email Verified At',
      type: 'datetime',
    }),
    defineField({
      name: 'phoneVerifiedAt',
      title: 'Phone Verified At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'role',
      media: 'avatar',
    },
  },
});
