import type { HttpContext } from '@adonisjs/core/http'
import projectionService from '#services/projection_service'

export default class ProjectionsController {
  async index({ inertia }: HttpContext) {
    const { sources, wishes, result } = await projectionService.load()
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
