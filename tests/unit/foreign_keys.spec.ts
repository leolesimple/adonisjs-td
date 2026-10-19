import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('Foreign keys', () => {
  test('deleting a wish cascades to its allocations', async ({ assert }) => {
    const [wishRow] = await db
      .table('wishes')
      .insert({ name: 'fk-test', price_cents: 100 })
      .returning('id')
    const [sourceRow] = await db
      .table('funding_sources')
      .insert({ name: 'fk-test' })
      .returning('id')
    const w = { id: typeof wishRow === 'object' ? wishRow.id : wishRow }
    const s = { id: typeof sourceRow === 'object' ? sourceRow.id : sourceRow }
    await db
      .table('allocations')
      .insert({ wish_id: w.id, funding_source_id: s.id, amount_cents: 50 })

    await db.from('wishes').where('id', w.id).delete()
    const left = await db.from('allocations').where('funding_source_id', s.id)
    await db.from('funding_sources').where('id', s.id).delete()

    assert.lengthOf(left, 0)
  })
})
