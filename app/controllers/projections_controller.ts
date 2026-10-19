import type { HttpContext } from '@adonisjs/core/http'
import { loadProjection } from '#services/projection_loader'

export default class ProjectionsController {
  // Tableau mois par mois : argent utilisable et bloqué par compte, achats du mois
  async index({ inertia }: HttpContext) {
    const { sources, wishes, result } = await loadProjection()
    const names = new Map(wishes.map((w) => [w.id, w.name]))
    const projections = new Map(result.wishes.map((p) => [p.wishId, p]))

    return inertia.render('projection/index', {
      sources: sources.map((s) => ({ id: s.id, name: s.name })),
      months: result.months.map((m) => ({
        month: m.month,
        date: m.date,
        usableCents: m.usableCents,
        lockedCents: m.lockedCents,
        purchases: m.purchases.map((id) => ({ id, name: names.get(id) ?? '' })),
      })),
      wishes: wishes.map((w) => ({
        id: w.id,
        name: w.name,
        rank: w.rank,
        priceCents: w.priceCents,
        projection: projections.get(w.id) ?? null,
      })),
    })
  }
}
