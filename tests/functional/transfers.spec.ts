import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'

test.group('Monthly transfers', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store creates a transfer between two accounts', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const response = await client
      .post('/transfers')
      .form({ fromSourceId: cchq.id, toSourceId: livret.id, amount: 200 })
      .redirects(0)

    response.assertStatus(302)
    const transfer = await MonthlyTransfer.firstOrFail()
    assert.equal(transfer.amountCents, 20000)
    assert.equal(transfer.toSourceId, livret.id)
  })

  test('store refuses a transfer from an account to itself', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    await client
      .post('/transfers')
      .form({ fromSourceId: cchq.id, toSourceId: cchq.id, amount: 200 })
      .redirects(0)
    assert.isNull(await MonthlyTransfer.first())
  })

  test('store returns 404 for an unknown account', async ({ client }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const response = await client
      .post('/transfers')
      .form({ fromSourceId: cchq.id, toSourceId: 999, amount: 200 })
      .redirects(0)
    response.assertStatus(404)
  })

  test('store rejects a non-positive amount', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await client
      .post('/transfers')
      .form({ fromSourceId: cchq.id, toSourceId: livret.id, amount: 0 })
      .redirects(0)
    assert.isNull(await MonthlyTransfer.first())
  })

  test('destroy removes a transfer', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const transfer = await MonthlyTransfer.create({
      fromSourceId: cchq.id,
      toSourceId: livret.id,
      amountCents: 20000,
    })
    await client.delete(`/transfers/${transfer.id}`).redirects(0)
    assert.isNull(await MonthlyTransfer.find(transfer.id))
  })

  test('deleting an account removes its transfers', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await MonthlyTransfer.create({
      fromSourceId: cchq.id,
      toSourceId: livret.id,
      amountCents: 20000,
    })
    await client.delete(`/sources/${livret.id}`).redirects(0)
    assert.isNull(await MonthlyTransfer.first())
  })
})
