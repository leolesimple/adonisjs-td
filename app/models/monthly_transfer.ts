import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { MonthlyTransferSchema } from '#database/schema'
import FundingSource from '#models/funding_source'

// Virement programmé chaque mois d'un compte vers un autre.
// L'argent arrivé sur le compte cible n'est utilisable qu'à la paie suivante.
export default class MonthlyTransfer extends MonthlyTransferSchema {
  @belongsTo(() => FundingSource, { foreignKey: 'fromSourceId' })
  declare fromSource: BelongsTo<typeof FundingSource>

  @belongsTo(() => FundingSource, { foreignKey: 'toSourceId' })
  declare toSource: BelongsTo<typeof FundingSource>
}
