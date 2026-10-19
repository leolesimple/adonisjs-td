import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import Allocation from '#models/allocation'

const makeWish = () =>
  Wish.create({ name: 'Casque', priceCents: 10000, priority: 'low', status: 'wished', rank: 1 })

test.group('Allocations', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store reserves an amount of an account for the wish', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const response = await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 43 })
      .redirects(0)

    response.assertStatus(302)
    const allocation = await Allocation.firstOrFail()
    assert.equal(allocation.amountCents, 4300)
    assert.equal(allocation.fundingSourceId, source.id)
  })

  test('store requires a positive amount', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id })
      .redirects(0)
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: -3 })
      .redirects(0)

    assert.isNull(await Allocation.first())
  })

  test('store returns 404 for an unknown source', async ({ client }) => {
    const wish = await makeWish()
    const response = await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: 999, amount: 10 })
      .redirects(0)

    response.assertStatus(404)
  })

  test('destroy removes an allocation', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const allocation = await Allocation.create({
      wishId: wish.id,
      fundingSourceId: source.id,
      amountCents: 1000,
    })
    await client.delete(`/allocations/${allocation.id}`).redirects(0)

    assert.isNull(await Allocation.find(allocation.id))
  })

  test('deleting a wish cascades to its allocations', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await Allocation.create({ wishId: wish.id, fundingSourceId: source.id, amountCents: 1000 })
    await client.delete(`/wishes/${wish.id}`).redirects(0)

    assert.isNull(await Allocation.first())
  })
})

test.group('Allocations | price cap', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store refuses an amount above what is left to allocate', async ({ client, assert }) => {
    const wish = await Wish.create({
      name: 'Clavier',
      priceCents: 12900,
      priority: 'low',
      status: 'wished',
      rank: 1,
    })
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 200 })
      .redirects(0)

    assert.isNull(await Allocation.first())
  })

  test('store accepts the exact remaining amount, then refuses any more', async ({
    client,
    assert,
  }) => {
    const wish = await Wish.create({
      name: 'Clavier',
      priceCents: 12900,
      priority: 'low',
      status: 'wished',
      rank: 1,
    })
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 100 })
      .redirects(0)
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 29 })
      .redirects(0)
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 0.01 })
      .redirects(0)

    const total = await Allocation.query().sum('amount_cents as total')
    assert.equal(Number(total[0].$extras.total), 12900)
  })
})
