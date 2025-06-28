import { defineField, defineType } from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'url',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Street',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
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
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'Turkish', value: 'tr' },
              { title: 'English', value: 'en' },
            ],
          },
          initialValue: 'tr',
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
        }),
        defineField({
          name: 'notifications',
          title: 'Notifications',
          type: 'object',
          fields: [
            defineField({
              name: 'email',
              title: 'Email Notifications',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'sms',
              title: 'SMS Notifications',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'push',
              title: 'Push Notifications',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'lastLoginAt',
      title: 'Last Login At',
      type: 'datetime',
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
      title: 'name',
      subtitle: 'email',
      media: 'image',
    },
  },
})
