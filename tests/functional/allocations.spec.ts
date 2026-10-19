import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import Allocation from '#models/allocation'

const makeWish = () =>
  Wish.create({
    name: 'Casque',
    priceCents: 10000,
    priority: 'low',
    status: 'wished',
    fundingMode: 'monthly',
  })

test.group('Allocations', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store adds a one-off amount', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const response = await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, amount: 143, availableOn: '2026-11-28' })
      .redirects(0)

    response.assertStatus(302)
    const allocation = await Allocation.firstOrFail()
    assert.equal(allocation.amountCents, 14300)
    assert.isNull(allocation.monthlyCents)
    assert.equal(allocation.availableOn?.toISODate(), '2026-11-28')
  })

  test('store adds a monthly amount', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id, monthly: 50 })
      .redirects(0)

    const allocation = await Allocation.firstOrFail()
    assert.equal(allocation.monthlyCents, 5000)
    assert.isNull(allocation.amountCents)
  })

  test('store requires at least one amount', async ({ client, assert }) => {
    const wish = await makeWish()
    const source = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await client
      .post(`/wishes/${wish.id}/allocations`)
      .form({ fundingSourceId: source.id })
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
