import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { FundingSourceSchema } from '#database/schema'
import Allocation from '#models/allocation'

export default class FundingSource extends FundingSourceSchema {
  @hasMany(() => Allocation)
  declare allocations: HasMany<typeof Allocation>
}
