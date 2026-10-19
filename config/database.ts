import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        // Base séparée pour les tests : ils ne touchent jamais aux données de démo
        filename: app.tmpPath(app.inTest ? 'db.test.sqlite3' : 'db.sqlite3'),
      },
      useNullAsDefault: true,
      // SQLite n'applique pas les clés étrangères (ON DELETE CASCADE) sans ce pragma
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
    },
  },
})

export default dbConfig
