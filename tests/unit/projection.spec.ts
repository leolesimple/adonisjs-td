import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { nextPayday, project, type ProjectionInput } from '#services/projection'
import { toCents } from '#services/money'

// Mardi 20 octobre 2026, paie le 1er : paies à venir le 1er nov., le 1er déc., le 1er janv.…
const today = DateTime.fromISO('2026-10-20')
const CHECKING = 1
const SAVINGS = 2

const base = (overrides: Partial<ProjectionInput> = {}): ProjectionInput => ({
  today,
  payDay: 1,
  sources: [
    { id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 0 },
    { id: SAVINGS, name: 'Livret A', balanceCents: 0, monthlyBudgetCents: 0 },
  ],
  transfers: [],
  wishes: [],
  ...overrides,
})

const wish = (
  id: number,
  rank: number,
  priceCents: number,
  allocations: { fundingSourceId: number; amountCents: number }[],
  targetDate: string | null = null
) => ({ id, rank, priceCents, targetDate, allocations })

test.group('money | toCents', () => {
  test('converts euros to integer cents without float drift', ({ assert }) => {
    assert.equal(toCents(19.99), 1999)
    assert.equal(toCents(0.1 + 0.2), 30)
  })
})

test.group('projection | nextPayday', () => {
  test('returns the first payday strictly after today', ({ assert }) => {
    assert.equal(nextPayday(today, 1, 1).toISODate(), '2026-11-01')
    assert.equal(nextPayday(today, 1, 3).toISODate(), '2027-01-01')
    assert.equal(nextPayday(today, 28, 1).toISODate(), '2026-10-28')
  })

  test('skips today when today is the payday', ({ assert }) => {
    assert.equal(nextPayday(DateTime.fromISO('2026-11-01'), 1, 1).toISODate(), '2026-12-01')
  })
})

test.group('projection | purchases', () => {
  test('a wish covered by current balances is ready now', ({ assert }) => {
    const input = base({
      sources: [{ id: SAVINGS, name: 'Livret A', balanceCents: 50000, monthlyBudgetCents: 0 }],
      wishes: [wish(1, 1, 45000, [{ fundingSourceId: SAVINGS, amountCents: 45000 }])],
    })
    const [result] = project(input).wishes
    assert.equal(result.state, 'ready')
    assert.equal(result.month, 0)
    assert.equal(result.date, '2026-10-20')
  })

  test('the monthly budget of the checking account accrues at each payday', ({ assert }) => {
    // 450 € à raison de 150 € par mois : acheté à la 3e paie
    const input = base({
      sources: [{ id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 15000 }],
      wishes: [wish(1, 1, 45000, [{ fundingSourceId: CHECKING, amountCents: 45000 }])],
    })
    const [result] = project(input).wishes
    assert.equal(result.state, 'planned')
    assert.equal(result.month, 3)
    assert.equal(result.date, '2027-01-01')
  })

  test('a transfer is locked until the next payday', ({ assert }) => {
    // 200 € virés le 1er nov. vers le Livret A : utilisables seulement le 1er déc.
    const input = base({
      transfers: [{ toSourceId: SAVINGS, amountCents: 20000 }],
      wishes: [wish(1, 1, 20000, [{ fundingSourceId: SAVINGS, amountCents: 20000 }])],
    })
    const { wishes, months } = project(input)
    assert.equal(wishes[0].month, 2)
    assert.equal(wishes[0].date, '2026-12-01')
    assert.equal(months[1].usableCents[SAVINGS], 0)
    assert.equal(months[1].lockedCents[SAVINGS], 20000)
  })

  test('a wish funded by two accounts waits for the slowest one', ({ assert }) => {
    const input = base({
      sources: [
        { id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 10000 },
        { id: SAVINGS, name: 'Livret A', balanceCents: 0, monthlyBudgetCents: 0 },
      ],
      transfers: [{ toSourceId: SAVINGS, amountCents: 20000 }],
      wishes: [
        wish(1, 1, 50000, [
          { fundingSourceId: CHECKING, amountCents: 10000 },
          { fundingSourceId: SAVINGS, amountCents: 40000 },
        ]),
      ],
    })
    // Livret A : 200 € débloqués à la paie 2, 400 € à la paie 3. Compte courant : 100 € dès la paie 1.
    assert.equal(project(input).wishes[0].month, 3)
  })

  test('sums several allocations on the same account', ({ assert }) => {
    const input = base({
      sources: [{ id: CHECKING, name: 'CCHQ', balanceCents: 10000, monthlyBudgetCents: 0 }],
      wishes: [
        wish(1, 1, 15000, [
          { fundingSourceId: CHECKING, amountCents: 5000 },
          { fundingSourceId: CHECKING, amountCents: 10000 },
        ]),
      ],
    })
    // 150 € demandés sur un compte à 100 € sans budget : jamais achetable
    assert.equal(project(input).wishes[0].state, 'beyond')
  })

  test('a price of 0 is ready immediately', ({ assert }) => {
    const [result] = project(base({ wishes: [wish(1, 1, 0, [])] })).wishes
    assert.equal(result.state, 'ready')
  })
})

test.group('projection | priority rank', () => {
  const sources = [{ id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 10000 }]

  test('the wish with the lowest rank is served first', ({ assert }) => {
    const input = base({
      sources,
      wishes: [
        wish(1, 2, 10000, [{ fundingSourceId: CHECKING, amountCents: 10000 }]),
        wish(2, 1, 10000, [{ fundingSourceId: CHECKING, amountCents: 10000 }]),
      ],
    })
    const byId = Object.fromEntries(project(input).wishes.map((w) => [w.wishId, w.month]))
    assert.equal(byId[2], 1)
    assert.equal(byId[1], 2)
  })

  test('a waiting wish keeps its money away from lower-ranked ones', ({ assert }) => {
    // Le rang 1 veut 300 €, le rang 2 veut 100 € : sans réservation, le rang 2 passerait
    // à la paie 1 et retarderait le rang 1 (qui a besoin des 100 € de la paie 1).
    const input = base({
      sources,
      wishes: [
        wish(1, 1, 30000, [{ fundingSourceId: CHECKING, amountCents: 30000 }]),
        wish(2, 2, 10000, [{ fundingSourceId: CHECKING, amountCents: 10000 }]),
      ],
    })
    const byId = Object.fromEntries(project(input).wishes.map((w) => [w.wishId, w.month]))
    assert.equal(byId[1], 3)
    assert.equal(byId[2], 4)
  })
})

test.group('projection | states', () => {
  test('a wish whose allocations do not cover the price is unallocated', ({ assert }) => {
    const input = base({
      sources: [{ id: CHECKING, name: 'CCHQ', balanceCents: 99999, monthlyBudgetCents: 0 }],
      wishes: [wish(1, 1, 60000, [{ fundingSourceId: CHECKING, amountCents: 14300 }])],
    })
    const [result] = project(input).wishes
    assert.equal(result.state, 'unallocated')
    assert.equal(result.allocatedCents, 14300)
    assert.equal(result.missingCents, 45700)
    assert.isNull(result.date)
  })

  test('a wish that cannot be afforded within the horizon is beyond', ({ assert }) => {
    const input = base({
      horizonMonths: 6,
      sources: [{ id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 1000 }],
      wishes: [wish(1, 1, 60000, [{ fundingSourceId: CHECKING, amountCents: 60000 }])],
    })
    const { wishes, months } = project(input)
    assert.equal(wishes[0].state, 'beyond')
    assert.lengthOf(months, 7)
  })

  test('reports whether the target date is met', ({ assert }) => {
    const sources = [{ id: CHECKING, name: 'CCHQ', balanceCents: 0, monthlyBudgetCents: 10000 }]
    const alloc = [{ fundingSourceId: CHECKING, amountCents: 20000 }]
    const input = base({
      sources,
      wishes: [
        wish(1, 1, 20000, alloc, '2026-12-01'),
        wish(2, 2, 20000, alloc, '2026-12-01'),
        wish(3, 3, 20000, alloc),
      ],
    })
    const byId = Object.fromEntries(project(input).wishes.map((w) => [w.wishId, w.onTime]))
    assert.isTrue(byId[1])
    assert.isFalse(byId[2])
    assert.isNull(byId[3])
  })
})
