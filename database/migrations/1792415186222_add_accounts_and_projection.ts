import { BaseSchema } from '@adonisjs/lucid/schema'

// Passe d'un modèle « mensualités par envie » à un modèle « comptes + virements + projection » :
// - les sources deviennent des comptes (solde, paie, budget envies, jour de paie)
// - un virement mensuel peut aller d'un compte à un autre (ex. compte courant vers Livret A)
// - les envies sont classées par rang ; le mode de financement disparaît (la date vient de la projection)
export default class extends BaseSchema {
  // PRAGMA foreign_keys est sans effet dans une transaction : on la désactive ici.
  // Sans ça, SQLite recrée les tables en les supprimant et le CASCADE efface les allocations.
  static disableTransactions = true

  async up() {
    this.schema.raw('PRAGMA foreign_keys = OFF')

    this.schema.alterTable('funding_sources', (table) => {
      table.bigInteger('balance_cents').notNullable().defaultTo(0)
      table.bigInteger('monthly_income_cents').nullable()
      table.bigInteger('monthly_budget_cents').nullable()
      table.integer('pay_day').nullable()
    })

    this.schema.createTable('monthly_transfers', (table) => {
      table.increments('id')
      table
        .integer('from_source_id')
        .unsigned()
        .references('funding_sources.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('to_source_id')
        .unsigned()
        .references('funding_sources.id')
        .onDelete('CASCADE')
        .notNullable()
      table.bigInteger('amount_cents').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('wishes', (table) => {
      table.integer('rank').notNullable().defaultTo(0)
      table.dropColumn('funding_mode')
    })

    // Une allocation n'a plus qu'un montant : les lignes « mensualité seule » passent à 0
    this.schema.raw('UPDATE allocations SET amount_cents = 0 WHERE amount_cents IS NULL')
    this.schema.alterTable('allocations', (table) => {
      table.dropColumn('monthly_cents')
      table.dropColumn('available_on')
      table.bigInteger('amount_cents').notNullable().defaultTo(0).alter()
    })

    // Les envies existantes reçoivent un rang dans l'ordre de création
    this.defer(async (db) => {
      const wishes = await db.from('wishes').select('id').orderBy('id')
      for (const [index, wish] of wishes.entries()) {
        await db
          .from('wishes')
          .where('id', wish.id)
          .update({ rank: index + 1 })
      }
    })

    // À la toute fin : le schéma et le defer s'exécutent dans l'ordre où ils sont déclarés
    this.defer(async (db) => {
      await db.rawQuery('PRAGMA foreign_keys = ON')
    })
  }

  async down() {
    this.schema.raw('PRAGMA foreign_keys = OFF')

    this.schema.alterTable('allocations', (table) => {
      table.bigInteger('monthly_cents').nullable()
      table.date('available_on').nullable()
    })

    this.schema.alterTable('wishes', (table) => {
      table.dropColumn('rank')
      table.enum('funding_mode', ['monthly', 'deadline']).notNullable().defaultTo('monthly')
    })

    this.schema.dropTable('monthly_transfers')

    this.schema.alterTable('funding_sources', (table) => {
      table.dropColumn('balance_cents')
      table.dropColumn('monthly_income_cents')
      table.dropColumn('monthly_budget_cents')
      table.dropColumn('pay_day')
    })

    this.defer(async (db) => {
      await db.rawQuery('PRAGMA foreign_keys = ON')
    })
  }
}
