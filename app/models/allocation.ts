import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { AllocationSchema } from '#database/schema'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'

export default class Allocation extends AllocationSchema {
  @belongsTo(() => Wish)
  declare wish: BelongsTo<typeof Wish>

  @belongsTo(() => FundingSource)
  declare fundingSource: BelongsTo<typeof FundingSource>
}
