import { DateTime } from 'luxon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import Allocation from '#models/allocation'

export default class extends BaseSeeder {
  async run() {
    // Évite de dupliquer les données de démo si le seeder est relancé
    if ((await Wish.query().first()) || (await FundingSource.query().first())) return

    const livretA = await FundingSource.create({ name: 'Livret A', type: 'savings' })
    const cchq = await FundingSource.create({ name: 'CCHQ', type: 'checking' })
    const paie = await FundingSource.create({
      name: 'Paie de novembre',
      type: 'income',
      notes: 'Versée en fin de mois',
    })

    // Mode mensualités : la date d'achat est estimée
    const ecran = await Wish.create({
      name: 'Écran 4K',
      priceCents: 60000,
      category: 'Setup',
      priority: 'high',
      status: 'funding',
      fundingMode: 'monthly',
    })
    await Allocation.createMany([
      { wishId: ecran.id, fundingSourceId: livretA.id, amountCents: 14300, monthlyCents: 15000 },
      { wishId: ecran.id, fundingSourceId: cchq.id, monthlyCents: 5000 },
    ])

    // Mode échéance : une date à tenir, financée par plusieurs sources
    const casque = await Wish.create({
      name: 'Casque audio',
      priceCents: 45000,
      category: 'Audio',
      priority: 'medium',
      status: 'funding',
      fundingMode: 'deadline',
      targetDate: DateTime.now().set({ month: 11, day: 10 }),
    })
    await Allocation.createMany([
      { wishId: casque.id, fundingSourceId: livretA.id, amountCents: 20000 },
      { wishId: casque.id, fundingSourceId: cchq.id, amountCents: 10000 },
      {
        wishId: casque.id,
        fundingSourceId: paie.id,
        amountCents: 15000,
        availableOn: DateTime.fromObject({ month: 11, day: 28 }),
      },
    ])

    // Envie sans financement pour l'instant
    await Wish.create({
      name: 'Clavier mécanique',
      priceCents: 12900,
      category: 'Setup',
      priority: 'low',
      status: 'wished',
      fundingMode: 'monthly',
    })
  }
}
