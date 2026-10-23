import { DateTime } from 'luxon'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'
import { project, type ProjectionResult } from '#services/projection'

const ACTIVE_STATUSES = ['wished', 'funding']

export interface LoadedProjection {
  sources: FundingSource[]
  transfers: MonthlyTransfer[]
  wishes: Wish[]
  result: ProjectionResult
}

export async function loadProjection(today = DateTime.now()): Promise<LoadedProjection> {
  const [sources, transfers, wishes] = await Promise.all([
    FundingSource.query().orderBy('name'),
    MonthlyTransfer.query().orderBy('id'),
    Wish.query().preload('allocations').orderBy('rank').orderBy('id'),
  ])

  const active = wishes.filter((wish) => ACTIVE_STATUSES.includes(wish.status))
  const payDay = sources.find((source) => source.payDay !== null)?.payDay ?? 1

  const result = project({
    today,
    payDay,
    sources: sources.map((s) => ({
      id: s.id,
      name: s.name,
      balanceCents: s.balanceCents,
      monthlyBudgetCents: s.monthlyBudgetCents ?? 0,
    })),
    transfers: transfers.map((t) => ({ toSourceId: t.toSourceId, amountCents: t.amountCents })),
    wishes: active.map((w) => ({
      id: w.id,
      rank: w.rank,
      priceCents: w.priceCents,
      targetDate: w.targetDate?.toISODate() ?? null,
      allocations: w.allocations.map((a) => ({
        fundingSourceId: a.fundingSourceId,
        amountCents: a.amountCents,
      })),
    })),
  })

  return { sources, transfers, wishes, result }
}
