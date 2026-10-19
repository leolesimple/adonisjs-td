import { BaseSchema } from '@adonisjs/lucid/schema'

// Un « compte » qui finance les envies : compte courant, Livret A…
export default class extends BaseSchema {
  protected tableName = 'funding_sources'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.enum('type', ['savings', 'checking', 'income']).notNullable().defaultTo('savings')
      table.text('notes').nullable()
      // Argent déjà utilisable pour les envies, en centimes
      table.bigInteger('balance_cents').notNullable().defaultTo(0)
      // Compte courant : paie mensuelle, budget mensuel consacré aux envies, jour de paie
      table.bigInteger('monthly_income_cents').nullable()
      table.bigInteger('monthly_budget_cents').nullable()
      table.integer('pay_day').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
