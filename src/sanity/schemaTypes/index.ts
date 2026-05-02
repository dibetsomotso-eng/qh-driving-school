import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import regulatoryInfo from './regulatoryInfo'
import blogPost from './blogPost'
import testimonial from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service, regulatoryInfo, blogPost, testimonial],
}
