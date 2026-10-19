import { BaseSchema } from '@adonisjs/lucid/schema'

// Virement programmé chaque mois d'un compte vers un autre.
// L'argent arrivé sur le compte cible n'est utilisable qu'à la paie suivante.
export default class extends BaseSchema {
  protected tableName = 'monthly_transfers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('from_source_id')
        .unsigned()
        .notNullable()
        .references('funding_sources.id')
        .onDelete('CASCADE')
      table
        .integer('to_source_id')
        .unsigned()
        .notNullable()
        .references('funding_sources.id')
        .onDelete('CASCADE')
      table.bigInteger('amount_cents').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
