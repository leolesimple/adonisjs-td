import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import FundingSource from '#models/funding_source'

test.group('Funding sources CRUD', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('index lists the sources', async ({ client, assert }) => {
    await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const response = await client.get('/sources').withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'sources/index')
    assert.equal(response.inertiaProps.sources[0].name, 'Livret A')
  })

  test('store creates a source', async ({ client, assert }) => {
    const response = await client
      .post('/sources')
      .form({ name: 'CCHQ', type: 'checking' })
      .redirects(0)

    response.assertStatus(302)
    const source = await FundingSource.firstOrFail()
    assert.equal(source.name, 'CCHQ')
    assert.equal(source.type, 'checking')
  })

  test('store rejects an unknown type', async ({ client, assert }) => {
    await client.post('/sources').form({ name: 'Truc', type: 'crypto' }).redirects(0)
    assert.isNull(await FundingSource.first())
  })

  test('update renames a source', async ({ client, assert }) => {
    const source = await FundingSource.create({ name: 'Livret', type: 'savings' })
    const response = await client
      .put(`/sources/${source.id}`)
      .form({ name: 'Livret A', type: 'savings' })
      .redirects(0)

    response.assertStatus(302)
    await source.refresh()
    assert.equal(source.name, 'Livret A')
  })

  test('destroy deletes the source', async ({ client, assert }) => {
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await client.delete(`/sources/${source.id}`).redirects(0)
    assert.isNull(await FundingSource.find(source.id))
  })
})
