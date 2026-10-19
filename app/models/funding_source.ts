import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Allocation from '#models/allocation'

export type FundingSourceType = 'savings' | 'checking' | 'income'

export default class FundingSource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: FundingSourceType

  @column()
  declare notes: string | null

  // Solde actuel du compte
  @column({ columnName: 'balance_cents' })
  declare balanceCents: number

  // Compte courant : paie mensuelle, budget mensuel consacré aux envies, jour de paie
  @column({ columnName: 'monthly_income_cents' })
  declare monthlyIncomeCents: number | null

  @column({ columnName: 'monthly_budget_cents' })
  declare monthlyBudgetCents: number | null

  @column({ columnName: 'pay_day' })
  declare payDay: number | null

  @hasMany(() => Allocation)
  declare allocations: HasMany<typeof Allocation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
