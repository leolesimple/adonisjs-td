import type { HttpContext } from '@adonisjs/core/http'
import FundingSource from '#models/funding_source'
import { fundingSourceValidator } from '#validators/funding_source'

export default class FundingSourcesController {
  async index({ inertia }: HttpContext) {
    const sources = await FundingSource.query().preload('allocations').orderBy('name')
    return inertia.render('sources/index', {
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        notes: s.notes,
        // Total mensuel et total ponctuel déjà alloués à partir de cette source
        monthlyCents: s.allocations.reduce((sum, a) => sum + (a.monthlyCents ?? 0), 0),
        allocatedCents: s.allocations.reduce((sum, a) => sum + (a.amountCents ?? 0), 0),
      })),
    })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(fundingSourceValidator)
    await FundingSource.create(data)
    return response.redirect().toRoute('sources.index')
  }

  async update({ params, request, response }: HttpContext) {
    const source = await FundingSource.findOrFail(params.id)
    const data = await request.validateUsing(fundingSourceValidator)
    await source.merge(data).save()
    return response.redirect().toRoute('sources.index')
  }

  async destroy({ params, response }: HttpContext) {
    const source = await FundingSource.findOrFail(params.id)
    await source.delete()
    return response.redirect().toRoute('sources.index')
  }
}
