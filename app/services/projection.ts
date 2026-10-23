import type { DateTime } from 'luxon'

export interface ProjectionSource {
  id: number
  name: string
  balanceCents: number
  monthlyBudgetCents: number
}

export interface ProjectionTransfer {
  toSourceId: number
  amountCents: number
}

export interface ProjectionWish {
  id: number
  rank: number
  priceCents: number
  targetDate: string | null
  allocations: { fundingSourceId: number; amountCents: number }[]
}

export interface ProjectionInput {
  today: DateTime
  payDay: number
  sources: ProjectionSource[]
  transfers: ProjectionTransfer[]
  wishes: ProjectionWish[]
  horizonMonths?: number
}

export type WishState = 'ready' | 'planned' | 'unallocated' | 'beyond'

export interface WishProjection {
  wishId: number
  state: WishState
  allocatedCents: number
  missingCents: number
  month: number | null
  date: string | null
  onTime: boolean | null
}

export interface MonthRow {
  month: number
  date: string
  usableCents: Record<number, number>
  lockedCents: Record<number, number>
  purchases: number[]
}

export interface ProjectionResult {
  wishes: WishProjection[]
  months: MonthRow[]
}

const DEFAULT_HORIZON = 24

export function nextPayday(today: DateTime, payDay: number, k: number): DateTime {
  const day = Math.min(Math.max(payDay, 1), 28)
  let first = today.startOf('day').set({ day })
  if (first <= today.startOf('day')) first = first.plus({ months: 1 })
  return first.plus({ months: k - 1 })
}

const sumBySource = (allocations: ProjectionWish['allocations']) => {
  const totals = new Map<number, number>()
  for (const a of allocations) {
    totals.set(a.fundingSourceId, (totals.get(a.fundingSourceId) ?? 0) + a.amountCents)
  }
  return totals
}

export function project(input: ProjectionInput): ProjectionResult {
  const horizon = input.horizonMonths ?? DEFAULT_HORIZON
  const pools = new Map(input.sources.map((s) => [s.id, s.balanceCents]))
  const ordered = [...input.wishes].sort((a, b) => a.rank - b.rank || a.id - b.id)

  const resolved = new Map<number, { month: number; date: string }>()
  const needs = new Map(ordered.map((w) => [w.id, sumBySource(w.allocations)]))
  const allocated = new Map(
    ordered.map((w) => [w.id, w.allocations.reduce((sum, a) => sum + a.amountCents, 0)])
  )
  const fullyAllocated = (w: ProjectionWish) => (allocated.get(w.id) ?? 0) >= w.priceCents

  const buy = (month: number, date: DateTime): number[] => {
    const reserved = new Map<number, number>()
    const bought: number[] = []
    for (const wish of ordered) {
      if (resolved.has(wish.id) || !fullyAllocated(wish)) continue
      const wanted = needs.get(wish.id)!
      const canBuy = [...wanted].every(
        ([sourceId, amount]) => (pools.get(sourceId) ?? 0) - (reserved.get(sourceId) ?? 0) >= amount
      )
      if (canBuy) {
        for (const [sourceId, amount] of wanted) pools.set(sourceId, pools.get(sourceId)! - amount)
        resolved.set(wish.id, { month, date: date.toISODate()! })
        bought.push(wish.id)
      } else {
        for (const [sourceId, amount] of wanted) {
          reserved.set(sourceId, (reserved.get(sourceId) ?? 0) + amount)
        }
      }
    }
    return bought
  }

  const snapshot = (map: Map<number, number>) =>
    Object.fromEntries(input.sources.map((s) => [s.id, map.get(s.id) ?? 0]))

  const months: MonthRow[] = []
  const today = input.today.startOf('day')
  months.push({
    month: 0,
    date: today.toISODate()!,
    purchases: buy(0, today),
    usableCents: snapshot(pools),
    lockedCents: snapshot(new Map()),
  })

  let incomingLastMonth = new Map<number, number>()
  for (let month = 1; month <= horizon; month++) {
    const date = nextPayday(today, input.payDay, month)

    for (const source of input.sources) {
      const unlocked = incomingLastMonth.get(source.id) ?? 0
      pools.set(source.id, pools.get(source.id)! + source.monthlyBudgetCents + unlocked)
    }

    const incomingNow = new Map<number, number>()
    for (const transfer of input.transfers) {
      incomingNow.set(
        transfer.toSourceId,
        (incomingNow.get(transfer.toSourceId) ?? 0) + transfer.amountCents
      )
    }
    incomingLastMonth = incomingNow

    months.push({
      month,
      date: date.toISODate()!,
      purchases: buy(month, date),
      usableCents: snapshot(pools),
      lockedCents: snapshot(incomingNow),
    })
  }

  const wishes: WishProjection[] = input.wishes.map((wish) => {
    const allocatedCents = allocated.get(wish.id) ?? 0
    const missingCents = Math.max(wish.priceCents - allocatedCents, 0)
    const result = resolved.get(wish.id)

    let state: WishState
    if (missingCents > 0) state = 'unallocated'
    else if (!result) state = 'beyond'
    else state = result.month === 0 ? 'ready' : 'planned'

    let onTime: boolean | null = null
    if (wish.targetDate) onTime = result ? result.date <= wish.targetDate : false

    return {
      wishId: wish.id,
      state,
      allocatedCents,
      missingCents,
      month: result?.month ?? null,
      date: result?.date ?? null,
      onTime,
    }
  })

  return { wishes, months }
}
