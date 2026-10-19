import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

// Personnalise les types TypeScript du fichier database/schema.ts (généré à chaque migration)
const column = [{ name: '@column' }]

export default {
  types: {
    // Les montants en centimes tiennent dans un number : pas besoin de bigint
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
