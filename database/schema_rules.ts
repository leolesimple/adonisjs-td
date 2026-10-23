import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

const column = [{ name: '@column' }]

export default {
  types: {
    bigint: { tsType: 'number', decorators: column },
  },
  tables: {
    wishes: {
      columns: {
        priority: { tsType: "'low' | 'medium' | 'high'", decorators: column },
        status: { tsType: "'wished' | 'funding' | 'bought' | 'dropped'", decorators: column },
      },
    },
    funding_sources: {
      columns: {
        type: { tsType: "'savings' | 'checking' | 'income'", decorators: column },
      },
    },
  },
} satisfies SchemaRules
