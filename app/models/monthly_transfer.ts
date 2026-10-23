import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { MonthlyTransferSchema } from '#database/schema'
import FundingSource from '#models/funding_source'

export default class MonthlyTransfer extends MonthlyTransferSchema {
  @belongsTo(() => FundingSource, { foreignKey: 'fromSourceId' })
  declare fromSource: BelongsTo<typeof FundingSource>

  @belongsTo(() => FundingSource, { foreignKey: 'toSourceId' })
  declare toSource: BelongsTo<typeof FundingSource>
}
