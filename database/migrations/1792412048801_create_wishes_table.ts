import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'wishes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      // Prix en centimes
      table.bigInteger('price_cents').notNullable()
      table.string('category').nullable()
      table.enum('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium')
      table.string('url').nullable()
      table.string('image_url').nullable()
      table.text('notes').nullable()
      table
        .enum('status', ['wished', 'funding', 'bought', 'dropped'])
        .notNullable()
        .defaultTo('wished')
      table.enum('funding_mode', ['monthly', 'deadline']).notNullable().defaultTo('monthly')
      table.date('target_date').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
