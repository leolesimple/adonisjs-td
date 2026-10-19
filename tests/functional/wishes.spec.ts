import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import Allocation from '#models/allocation'

const valid = {
  name: 'Écran 4K',
  price: 599.99,
  priority: 'high',
  status: 'wished',
}

const makeWish = (overrides: Partial<Wish> = {}) =>
  Wish.create({
    name: 'Casque',
    priceCents: 10000,
    priority: 'low',
    status: 'wished',
    rank: 1,
    ...overrides,
  })

test.group('Wishes CRUD', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('index lists wishes with their projection', async ({ client, assert }) => {
    const source = await FundingSource.create({
      name: 'Livret A',
      type: 'savings',
      balanceCents: 50000,
    })
    const wish = await makeWish({ priceCents: 10000 })
    await Allocation.create({ wishId: wish.id, fundingSourceId: source.id, amountCents: 10000 })

    const response = await client.get('/wishes').withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'wishes/index')
    assert.lengthOf(response.inertiaProps.wishes, 1)
    assert.equal(response.inertiaProps.wishes[0].projection.state, 'ready')
  })

  test('index filters by status and ignores unknown statuses', async ({ client, assert }) => {
    await makeWish({ name: 'A', rank: 1 })
    await makeWish({ name: 'B', rank: 2, status: 'bought' })
    const filtered = await client.get('/wishes?status=bought').withInertia()
    assert.deepEqual(
      filtered.inertiaProps.wishes.map((w: { name: string }) => w.name),
      ['B']
    )

    const unknown = await client.get('/wishes?status=nope').withInertia()
    assert.lengthOf(unknown.inertiaProps.wishes, 2)
  })

  test('store creates a wish at the last rank and converts euros to cents', async ({
    client,
    assert,
  }) => {
    await makeWish({ rank: 4 })
    const response = await client.post('/wishes').form(valid).redirects(0)

    response.assertStatus(302)
    const created = await Wish.query().where('name', 'Écran 4K').firstOrFail()
    assert.equal(created.priceCents, 59999)
    assert.equal(created.rank, 5)
    assert.isNull(created.category)
  })

  test('store rejects invalid data', async ({ client, assert }) => {
    const response = await client
      .post('/wishes')
      .form({ ...valid, name: '', price: -5 })
      .redirects(0)

    response.assertStatus(302)
    assert.isNull(await Wish.first())
  })

  test('store keeps the optional target date', async ({ client, assert }) => {
    await client
      .post('/wishes')
      .form({ ...valid, targetDate: '2026-11-10' })
      .redirects(0)
    const wish = await Wish.firstOrFail()
    assert.equal(wish.targetDate?.toISODate(), '2026-11-10')
  })

  test('show returns the wish, its allocations and the available sources', async ({
    client,
    assert,
  }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await Allocation.create({ wishId: wish.id, fundingSourceId: source.id, amountCents: 2500 })

    const response = await client.get(`/wishes/${wish.id}`).withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'wishes/show')
    assert.equal(response.inertiaProps.wish.name, 'Casque')
    assert.equal(response.inertiaProps.wish.allocations[0].fundingSourceName, 'CCHQ')
    assert.lengthOf(response.inertiaProps.sources, 1)
  })

  test('show still works for a bought wish, outside the projection', async ({ client, assert }) => {
    const wish = await makeWish({ status: 'bought' })
    const response = await client.get(`/wishes/${wish.id}`).withInertia()

    response.assertStatus(200)
    assert.isNull(response.inertiaProps.wish.projection)
  })

  test('show returns 404 for an unknown wish', async ({ client }) => {
    const response = await client.get('/wishes/999').withInertia()
    response.assertStatus(404)
  })

  test('update changes fields and clears optional ones', async ({ client, assert }) => {
    const wish = await makeWish({ name: 'Ancien nom', category: 'Setup', priceCents: 1000 })
    const response = await client
      .put(`/wishes/${wish.id}`)
      .form({ ...valid, name: 'Nouveau nom', category: '' })
      .redirects(0)

    response.assertStatus(302)
    await wish.refresh()
    assert.equal(wish.name, 'Nouveau nom')
    assert.equal(wish.priceCents, 59999)
    assert.isNull(wish.category)
  })

  test('move swaps the rank with the neighbour', async ({ client, assert }) => {
    const first = await makeWish({ name: 'Premier', rank: 1 })
    const second = await makeWish({ name: 'Second', rank: 2 })

    await client.post(`/wishes/${second.id}/move`).form({ direction: 'up' }).redirects(0)
    await first.refresh()
    await second.refresh()
    assert.equal(second.rank, 1)
    assert.equal(first.rank, 2)
  })

  test('move does nothing at the edges and rejects bad directions', async ({ client, assert }) => {
    const only = await makeWish({ rank: 1 })

    await client.post(`/wishes/${only.id}/move`).form({ direction: 'up' }).redirects(0)
    await client.post(`/wishes/${only.id}/move`).form({ direction: 'sideways' }).redirects(0)
    await only.refresh()
    assert.equal(only.rank, 1)
  })

  test('destroy deletes the wish', async ({ client, assert }) => {
    const wish = await makeWish({ name: 'À supprimer' })
    const response = await client.delete(`/wishes/${wish.id}`).redirects(0)

    response.assertStatus(302)
    assert.isNull(await Wish.find(wish.id))
  })
})
