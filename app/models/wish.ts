import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { WishSchema } from '#database/schema'
import Allocation from '#models/allocation'

// Les colonnes viennent de database/schema.ts (généré). Ici : seulement les relations.
export default class Wish extends WishSchema {
  @hasMany(() => Allocation)
  declare allocations: HasMany<typeof Allocation>
}
