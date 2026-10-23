import type { HttpContext } from '@adonisjs/core/http'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'
import { fundingSourceValidator } from '#validators/funding_source'
import { toCents } from '#services/money'

const optionalCents = (euros: number | undefined) => (euros === undefined ? null : toCents(euros))

const toColumns = (payload: Awaited<ReturnType<typeof fundingSourceValidator.validate>>) => ({
  name: payload.name,
  type: payload.type,
  notes: payload.notes ?? null,
  balanceCents: toCents(payload.balance),
  monthlyIncomeCents: optionalCents(payload.monthlyIncome),
  monthlyBudgetCents: optionalCents(payload.monthlyBudget),
  payDay: payload.payDay ?? null,
})

export default class FundingSourcesController {
  async index({ inertia }: HttpContext) {
    const [sources, transfers] = await Promise.all([
      FundingSource.query().preload('allocations').orderBy('name'),
      MonthlyTransfer.query().preload('fromSource').preload('toSource').orderBy('id'),
    ])
    return inertia.render('sources/index', {
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        notes: s.notes,
        balanceCents: s.balanceCents,
        monthlyIncomeCents: s.monthlyIncomeCents,
        monthlyBudgetCents: s.monthlyBudgetCents,
        payDay: s.payDay,
        allocatedCents: s.allocations.reduce((sum, a) => sum + a.amountCents, 0),
      })),
      transfers: transfers.map((t) => ({
        id: t.id,
        fromSourceId: t.fromSourceId,
        fromSourceName: t.fromSource.name,
        toSourceId: t.toSourceId,
        toSourceName: t.toSource.name,
        amountCents: t.amountCents,
      })),
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(fundingSourceValidator)
    await FundingSource.create(toColumns(payload))
    return response.redirect().toRoute('sources.index')
  }

  async update({ params, request, response }: HttpContext) {
    const source = await FundingSource.findOrFail(params.id)
    const payload = await request.validateUsing(fundingSourceValidator)
    await source.merge(toColumns(payload)).save()
    return response.redirect().toRoute('sources.index')
  }

  async destroy({ params, response }: HttpContext) {
    const source = await FundingSource.findOrFail(params.id)
    await source.delete()
    return response.redirect().toRoute('sources.index')
  }
}
