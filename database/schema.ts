import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class AllocationSchema extends BaseModel {
  static $columns = ['amountCents', 'createdAt', 'fundingSourceId', 'id', 'updatedAt', 'wishId'] as const
  $columns = AllocationSchema.$columns
  @column()
  declare amountCents: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare fundingSourceId: number
  @column({ isPrimary: true })
  declare id: number
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  @column()
  declare wishId: number
}

export class FundingSourceSchema extends BaseModel {
  static $columns = ['balanceCents', 'createdAt', 'id', 'monthlyBudgetCents', 'monthlyIncomeCents', 'name', 'notes', 'payDay', 'type', 'updatedAt'] as const
  $columns = FundingSourceSchema.$columns
  @column()
  declare balanceCents: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare monthlyBudgetCents: number | null
  @column()
  declare monthlyIncomeCents: number | null
  @column()
  declare name: string
  @column()
  declare notes: string | null
  @column()
  declare payDay: number | null
  @column()
  declare type: 'savings' | 'checking' | 'income'
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class MonthlyTransferSchema extends BaseModel {
  static $columns = ['amountCents', 'createdAt', 'fromSourceId', 'id', 'toSourceId', 'updatedAt'] as const
  $columns = MonthlyTransferSchema.$columns
  @column()
  declare amountCents: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare fromSourceId: number
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare toSourceId: number
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class WishSchema extends BaseModel {
  static $columns = ['category', 'createdAt', 'id', 'imageUrl', 'name', 'notes', 'priceCents', 'priority', 'rank', 'status', 'targetDate', 'updatedAt', 'url'] as const
  $columns = WishSchema.$columns
  @column()
  declare category: string | null
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare imageUrl: string | null
  @column()
  declare name: string
  @column()
  declare notes: string | null
  @column()
  declare priceCents: number
  @column()
  declare priority: 'low' | 'medium' | 'high'
  @column()
  declare rank: number
  @column()
  declare status: 'wished' | 'funding' | 'bought' | 'dropped'
  @column.date()
  declare targetDate: DateTime | null
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  @column()
  declare url: string | null
}
