import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import { wishValidator } from '#validators/wish'
import { summarize, toCents } from '#services/funding'

const serialize = (wish: Wish) => ({
  id: wish.id,
  name: wish.name,
  priceCents: wish.priceCents,
  category: wish.category,
  priority: wish.priority,
  url: wish.url,
  imageUrl: wish.imageUrl,
  notes: wish.notes,
  status: wish.status,
  fundingMode: wish.fundingMode,
  targetDate: wish.targetDate?.toISODate() ?? null,
  funding: summarize(wish),
})

const STATUSES = ['wished', 'funding', 'bought', 'dropped']

// Transforme les données validées (euros, champs optionnels absents) en colonnes de la table.
// Les champs vidés dans le formulaire sont remis à null explicitement.
const toColumns = (payload: Awaited<ReturnType<typeof wishValidator.validate>>) => ({
  name: payload.name,
  priceCents: toCents(payload.price),
  category: payload.category ?? null,
  priority: payload.priority,
  url: payload.url ?? null,
  imageUrl: payload.imageUrl ?? null,
  notes: payload.notes ?? null,
  status: payload.status,
  fundingMode: payload.fundingMode,
  targetDate: payload.targetDate ? DateTime.fromJSDate(payload.targetDate) : null,
})

export default class WishesController {
  async index({ inertia, request }: HttpContext) {
    const requested = request.input('status')
    const status = STATUSES.includes(requested) ? requested : null
    const query = Wish.query().preload('allocations').orderBy('created_at', 'desc')
    if (status) query.where('status', status)
    const wishes = await query
    return inertia.render('wishes/index', { wishes: wishes.map(serialize), status })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(wishValidator)
    const wish = await Wish.create(toColumns(payload))
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async show({ params, inertia }: HttpContext) {
    const wish = await Wish.query()
      .where('id', params.id)
      .preload('allocations', (q) => q.preload('fundingSource'))
      .firstOrFail()
    const sources = await FundingSource.query().orderBy('name')
    return inertia.render('wishes/show', {
      wish: {
        ...serialize(wish),
        allocations: wish.allocations.map((a) => ({
          id: a.id,
          fundingSourceId: a.fundingSourceId,
          fundingSourceName: a.fundingSource.name,
          amountCents: a.amountCents,
          monthlyCents: a.monthlyCents,
          availableOn: a.availableOn?.toISODate() ?? null,
        })),
      },
      sources: sources.map((s) => ({ id: s.id, name: s.name, type: s.type })),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const wish = await Wish.findOrFail(params.id)
    const payload = await request.validateUsing(wishValidator)
    wish.merge(toColumns(payload))
    await wish.save()
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async destroy({ params, response }: HttpContext) {
    const wish = await Wish.findOrFail(params.id)
    await wish.delete()
    return response.redirect().toRoute('wishes.index')
  }
}
