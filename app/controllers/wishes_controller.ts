import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Wish from '#models/wish'
import { wishMoveValidator, wishValidator } from '#validators/wish'
import { toCents } from '#services/money'
import projectionService from '#services/projection_service'
import type { WishProjection } from '#services/projection_service'

const STATUSES = ['wished', 'funding', 'bought', 'dropped']

const toColumns = (payload: Awaited<ReturnType<typeof wishValidator.validate>>) => ({
  name: payload.name,
  priceCents: toCents(payload.price),
  category: payload.category ?? null,
  priority: payload.priority,
  url: payload.url ?? null,
  imageUrl: payload.imageUrl ?? null,
  notes: payload.notes ?? null,
  status: payload.status,
  targetDate: payload.targetDate ? DateTime.fromJSDate(payload.targetDate) : null,
})

const serialize = (wish: Wish, projection?: WishProjection) => ({
  id: wish.id,
  name: wish.name,
  priceCents: wish.priceCents,
  category: wish.category,
  priority: wish.priority,
  rank: wish.rank,
  url: wish.url,
  imageUrl: wish.imageUrl,
  notes: wish.notes,
  status: wish.status,
  targetDate: wish.targetDate?.toISODate() ?? null,
  allocatedCents: wish.allocations.reduce((sum, a) => sum + a.amountCents, 0),
  projection: projection ?? null,
})

export default class WishesController {
  async index({ inertia, request }: HttpContext) {
    const requested = request.input('status')
    const status = STATUSES.includes(requested) ? requested : null
    const { wishes, result } = await projectionService.load()
    const projections = new Map(result.wishes.map((p) => [p.wishId, p]))

    const visible = wishes.filter((wish) => !status || wish.status === status)
    return inertia.render('wishes/index', {
      wishes: visible.map((wish) => serialize(wish, projections.get(wish.id))),
      status,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(wishValidator)
    const last = await Wish.query().max('rank as max').first()
    const rank = Number(last?.$extras.max ?? 0) + 1
    const wish = await Wish.create({ ...toColumns(payload), rank })
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async show({ params, inertia }: HttpContext) {
    const { wishes, sources, result } = await projectionService.load()
    const wish = wishes.find((w) => w.id === Number(params.id))
    if (!wish) {
      const found = await Wish.query()
        .where('id', params.id)
        .preload('allocations', (q) => q.preload('fundingSource'))
        .firstOrFail()
      return inertia.render('wishes/show', {
        wish: this.withAllocations(found),
        sources: sources.map((s) => ({ id: s.id, name: s.name })),
      })
    }
    await wish.load('allocations', (q) => q.preload('fundingSource'))
    const projection = result.wishes.find((p) => p.wishId === wish.id)
    return inertia.render('wishes/show', {
      wish: this.withAllocations(wish, projection),
      sources: sources.map((s) => ({ id: s.id, name: s.name })),
    })
  }

  private withAllocations(wish: Wish, projection?: WishProjection) {
    return {
      ...serialize(wish, projection),
      allocations: wish.allocations.map((a) => ({
        id: a.id,
        fundingSourceId: a.fundingSourceId,
        fundingSourceName: a.fundingSource.name,
        amountCents: a.amountCents,
      })),
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const wish = await Wish.query().where('id', params.id).preload('allocations').firstOrFail()
    const payload = await request.validateUsing(wishValidator)

    const allocatedCents = wish.allocations.reduce((sum, a) => sum + a.amountCents, 0)
    if (toCents(payload.price) < allocatedCents) {
      session.flash('errors', {
        price: `Le prix ne peut pas être inférieur aux ${(allocatedCents / 100).toFixed(2).replace('.', ',')} € déjà alloués.`,
      })
      return response.redirect().back()
    }
    wish.merge(toColumns(payload))
    await wish.save()
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async move({ params, request, response }: HttpContext) {
    const { direction } = await request.validateUsing(wishMoveValidator)
    const wish = await Wish.findOrFail(params.id)
    const neighbour = await Wish.query()
      .where('rank', direction === 'up' ? '<' : '>', wish.rank)
      .orderBy('rank', direction === 'up' ? 'desc' : 'asc')
      .first()

    if (neighbour) {
      const rank = wish.rank
      wish.rank = neighbour.rank
      neighbour.rank = rank
      await Promise.all([wish.save(), neighbour.save()])
    }
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const wish = await Wish.findOrFail(params.id)
    await wish.delete()
    return response.redirect().toRoute('wishes.index')
  }
}
