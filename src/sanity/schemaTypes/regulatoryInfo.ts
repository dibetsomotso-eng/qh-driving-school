import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'regulatoryInfo',
  title: 'Regulatory Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fees', value: 'fees' },
          { title: 'Laws', value: 'laws' },
          { title: 'Procedures', value: 'procedures' },
          { title: 'Policies', value: 'policies' },
        ],
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
