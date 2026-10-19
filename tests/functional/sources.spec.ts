import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'

test.group('Funding sources CRUD', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('index lists the sources and the monthly transfers', async ({ client, assert }) => {
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await MonthlyTransfer.create({
      fromSourceId: cchq.id,
      toSourceId: livret.id,
      amountCents: 20000,
    })

    const response = await client.get('/sources').withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'sources/index')
    assert.lengthOf(response.inertiaProps.sources, 2)
    assert.equal(response.inertiaProps.transfers[0].toSourceName, 'Livret A')
  })

  test('store creates an account with euros converted to cents', async ({ client, assert }) => {
    const response = await client
      .post('/sources')
      .form({
        name: 'CCHQ',
        type: 'checking',
        balance: 12.5,
        monthlyIncome: 1500,
        monthlyBudget: 150,
        payDay: 1,
      })
      .redirects(0)

    response.assertStatus(302)
    const source = await FundingSource.firstOrFail()
    assert.equal(source.balanceCents, 1250)
    assert.equal(source.monthlyIncomeCents, 150000)
    assert.equal(source.monthlyBudgetCents, 15000)
    assert.equal(source.payDay, 1)
  })

  test('store rejects an unknown type and a pay day out of range', async ({ client, assert }) => {
    await client.post('/sources').form({ name: 'Truc', type: 'crypto', balance: 0 }).redirects(0)
    await client
      .post('/sources')
      .form({ name: 'Truc', type: 'checking', balance: 0, payDay: 31 })
      .redirects(0)
    assert.isNull(await FundingSource.first())
  })

  test('update renames a source and clears optional fields', async ({ client, assert }) => {
    const source = await FundingSource.create({
      name: 'Livret',
      type: 'savings',
      monthlyBudgetCents: 5000,
    })
    const response = await client
      .put(`/sources/${source.id}`)
      .form({ name: 'Livret A', type: 'savings', balance: 500 })
      .redirects(0)

    response.assertStatus(302)
    await source.refresh()
    assert.equal(source.name, 'Livret A')
    assert.equal(source.balanceCents, 50000)
    assert.isNull(source.monthlyBudgetCents)
  })

  test('destroy deletes the source', async ({ client, assert }) => {
    const source = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await client.delete(`/sources/${source.id}`).redirects(0)
    assert.isNull(await FundingSource.find(source.id))
  })
})
