import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'
import Allocation from '#models/allocation'

test.group('Projection page', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('renders the month by month table with purchases', async ({ client, assert }) => {
    const cchq = await FundingSource.create({
      name: 'CCHQ',
      type: 'checking',
      monthlyBudgetCents: 10000,
      payDay: 1,
    })
    const livret = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    await MonthlyTransfer.create({
      fromSourceId: cchq.id,
      toSourceId: livret.id,
      amountCents: 20000,
    })
    const wish = await Wish.create({
      name: 'Casque',
      priceCents: 10000,
      priority: 'low',
      status: 'wished',
      rank: 1,
    })
    await Allocation.create({ wishId: wish.id, fundingSourceId: cchq.id, amountCents: 10000 })

    const response = await client.get('/projection').withInertia()

    response.assertStatus(200)
    assert.equal(response.inertiaComponent, 'projection/index')
    // mois 0 + 24 mois de projection
    assert.lengthOf(response.inertiaProps.months, 25)
    const purchaseMonth = response.inertiaProps.months.find(
      (m: { purchases: unknown[] }) => m.purchases.length > 0
    )
    assert.equal(purchaseMonth.month, 1)
    assert.equal(purchaseMonth.purchases[0].name, 'Casque')
    // le virement du mois est bloqué sur le Livret A
    assert.equal(response.inertiaProps.months[1].lockedCents[livret.id], 20000)
  })

  test('works with no data at all', async ({ client, assert }) => {
    const response = await client.get('/projection').withInertia()
    response.assertStatus(200)
    assert.lengthOf(response.inertiaProps.wishes, 0)
  })
})
