import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'

export default class Allocation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'wish_id' })
  declare wishId: number

  @column({ columnName: 'funding_source_id' })
  declare fundingSourceId: number

  // Montant que l'envie prélève sur cette source
  @column({ columnName: 'amount_cents' })
  declare amountCents: number

  @belongsTo(() => Wish)
  declare wish: BelongsTo<typeof Wish>

  @belongsTo(() => FundingSource)
  declare fundingSource: BelongsTo<typeof FundingSource>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
