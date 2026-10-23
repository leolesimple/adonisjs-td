import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'
import Allocation from '#models/allocation'

export default class extends BaseSeeder {
  async run() {
    if ((await Wish.query().first()) || (await FundingSource.query().first())) return

    const cchq = await FundingSource.create({
      name: 'CCHQ',
      type: 'checking',
      notes: 'Compte courant',
      balanceCents: 0,
      monthlyIncomeCents: 150000,
      monthlyBudgetCents: 15000,
      payDay: 1,
    })
    const livretA = await FundingSource.create({
      name: 'Livret A',
      type: 'savings',
      balanceCents: 50000,
    })
    await MonthlyTransfer.create({
      fromSourceId: cchq.id,
      toSourceId: livretA.id,
      amountCents: 20000,
    })

    const ecran = await Wish.create({
      name: 'Écran 4K',
      priceCents: 60000,
      category: 'Setup',
      priority: 'high',
      status: 'funding',
      rank: 1,
    })
    await Allocation.createMany([
      { wishId: ecran.id, fundingSourceId: livretA.id, amountCents: 45000 },
      { wishId: ecran.id, fundingSourceId: cchq.id, amountCents: 15000 },
    ])

    const casque = await Wish.create({
      name: 'Casque audio',
      priceCents: 45000,
      category: 'Audio',
      priority: 'medium',
      status: 'funding',
      rank: 2,
      targetDate: DateTime.now().plus({ months: 1 }).startOf('month'),
    })
    await Allocation.createMany([
      { wishId: casque.id, fundingSourceId: livretA.id, amountCents: 20000 },
      { wishId: casque.id, fundingSourceId: cchq.id, amountCents: 25000 },
    ])

    await Wish.create({
      name: 'Clavier mécanique',
      priceCents: 12900,
      category: 'Setup',
      priority: 'low',
      status: 'wished',
      rank: 3,
    })
  }
}
