import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',

  connections: {
    sqlite: {
      client: 'better-sqlite3',

      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },

      useNullAsDefault: true,

      pool: {
        afterCreate: (conn: any, done: (err: Error | null, conn: any) => void) => {
          conn.pragma('foreign_keys = ON')
          done(null, conn)
        },
      },

      migrations: {
        naturalSort: true,

        paths: ['database/migrations'],
      },

      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
    },
  },
})

export default dbConfig
