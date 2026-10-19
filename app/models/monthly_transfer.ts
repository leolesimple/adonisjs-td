import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FundingSource from '#models/funding_source'

// Virement programmé chaque mois d'un compte vers un autre.
// L'argent arrivé sur le compte cible n'est utilisable qu'à la paie suivante.
export default class MonthlyTransfer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'from_source_id' })
  declare fromSourceId: number

  @column({ columnName: 'to_source_id' })
  declare toSourceId: number

  @column({ columnName: 'amount_cents' })
  declare amountCents: number

  @belongsTo(() => FundingSource, { foreignKey: 'fromSourceId' })
  declare fromSource: BelongsTo<typeof FundingSource>

  @belongsTo(() => FundingSource, { foreignKey: 'toSourceId' })
  declare toSource: BelongsTo<typeof FundingSource>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
