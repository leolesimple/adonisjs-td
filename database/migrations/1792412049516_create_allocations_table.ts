import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'allocations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('wish_id').unsigned().references('wishes.id').onDelete('CASCADE').notNullable()
      table
        .integer('funding_source_id')
        .unsigned()
        .references('funding_sources.id')
        .onDelete('CASCADE')
        .notNullable()
      // Mode échéance : montant ponctuel en centimes
      table.bigInteger('amount_cents').nullable()
      // Mode mensualités : montant mis de côté chaque mois, en centimes
      table.bigInteger('monthly_cents').nullable()
      // Date à partir de laquelle l'argent est disponible (ex. paie de novembre)
      table.date('available_on').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
