import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'QH Driving School CMS',

  projectId: 'zxoaykhf',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schema.types,
  },
})
