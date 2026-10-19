import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Allocation from '#models/allocation'

export type WishPriority = 'low' | 'medium' | 'high'
export type WishStatus = 'wished' | 'funding' | 'bought' | 'dropped'
export type FundingMode = 'monthly' | 'deadline'

export default class Wish extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'price_cents' })
  declare priceCents: number

  @column()
  declare category: string | null

  @column()
  declare priority: WishPriority

  @column()
  declare url: string | null

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare notes: string | null

  @column()
  declare status: WishStatus

  @column({ columnName: 'funding_mode' })
  declare fundingMode: FundingMode

  @column.date()
  declare targetDate: DateTime | null

  @hasMany(() => Allocation)
  declare allocations: HasMany<typeof Allocation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
