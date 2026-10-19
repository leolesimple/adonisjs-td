import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { summarize, toCents } from '#services/funding'

const alloc = (amountCents: number | null, monthlyCents: number | null = null) => ({
  amountCents,
  monthlyCents,
})

test.group('funding | toCents', () => {
  test('converts euros to integer cents without float drift', ({ assert }) => {
    assert.equal(toCents(19.99), 1999)
    assert.equal(toCents(0.1 + 0.2), 30)
  })
})

test.group('funding | monthly mode', () => {
  test('estimates months left, rounded up', ({ assert }) => {
    // 600 € - 143 € déjà réunis = 457 € restants, 200 €/mois => 3 mois (2,285 arrondi au supérieur)
    const result = summarize({
      priceCents: 60000,
      fundingMode: 'monthly',
      allocations: [alloc(14300, 15000), alloc(null, 5000)],
    })
    assert.equal(result.fundedCents, 14300)
    assert.equal(result.monthlyCents, 20000)
    assert.equal(result.remainingCents, 45700)
    assert.equal(result.monthsLeft, 3)
    assert.equal(result.estimatedDate, DateTime.now().plus({ months: 3 }).toISODate())
    assert.isFalse(result.covered)
  })

  test('has no estimate without any monthly amount', ({ assert }) => {
    const result = summarize({
      priceCents: 10000,
      fundingMode: 'monthly',
      allocations: [alloc(2000)],
    })
    assert.isNull(result.monthsLeft)
    assert.isNull(result.estimatedDate)
    assert.equal(result.remainingCents, 8000)
  })

  test('is covered with zero months left when already funded', ({ assert }) => {
    const result = summarize({
      priceCents: 10000,
      fundingMode: 'monthly',
      allocations: [alloc(10000)],
    })
    assert.isTrue(result.covered)
    assert.equal(result.monthsLeft, 0)
    assert.equal(result.remainingCents, 0)
    assert.equal(result.progress, 1)
  })

  test('caps progress at 100 % and remaining at 0 when over-funded', ({ assert }) => {
    const result = summarize({
      priceCents: 10000,
      fundingMode: 'monthly',
      allocations: [alloc(25000)],
    })
    assert.equal(result.progress, 1)
    assert.equal(result.remainingCents, 0)
  })

  test('treats a price of 0 as covered with 0 progress', ({ assert }) => {
    const result = summarize({ priceCents: 0, fundingMode: 'monthly', allocations: [] })
    assert.isTrue(result.covered)
    assert.equal(result.progress, 0)
    assert.equal(result.monthsLeft, 0)
  })
})

test.group('funding | deadline mode', () => {
  test('reports funded total and remaining amount', ({ assert }) => {
    const result = summarize({
      priceCents: 45000,
      fundingMode: 'deadline',
      allocations: [alloc(20000), alloc(10000), alloc(5000)],
    })
    assert.equal(result.fundedCents, 35000)
    assert.equal(result.remainingCents, 10000)
    assert.isFalse(result.covered)
    assert.isNull(result.monthsLeft)
    assert.isNull(result.estimatedDate)
  })

  test('is covered once the allocations reach the price', ({ assert }) => {
    const result = summarize({
      priceCents: 45000,
      fundingMode: 'deadline',
      allocations: [alloc(30000), alloc(15000)],
    })
    assert.isTrue(result.covered)
    assert.equal(result.remainingCents, 0)
  })

  test('ignores monthly amounts for the funded total', ({ assert }) => {
    const result = summarize({
      priceCents: 10000,
      fundingMode: 'deadline',
      allocations: [alloc(null, 5000)],
    })
    assert.equal(result.fundedCents, 0)
    assert.equal(result.remainingCents, 10000)
  })
})
