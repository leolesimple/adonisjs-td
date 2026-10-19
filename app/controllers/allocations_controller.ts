import type { HttpContext } from '@adonisjs/core/http'
import Allocation from '#models/allocation'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import { allocationValidator } from '#validators/allocation'
import { toCents } from '#services/money'

const formatEuros = (cents: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)

export default class AllocationsController {
  async store({ params, request, response, session }: HttpContext) {
    const wish = await Wish.findOrFail(params.wishId)
    const { fundingSourceId, amount } = await request.validateUsing(allocationValidator)
    // 404 plutôt qu'une erreur SQL si la source n'existe pas
    await FundingSource.findOrFail(fundingSourceId)
    // On ne peut pas allouer plus que le prix : erreur affichée sous le champ montant
    const amountCents = toCents(amount)
    const allocated = await Allocation.query()
      .where('wish_id', wish.id)
      .sum('amount_cents as total')
    const remainingCents = wish.priceCents - Number(allocated[0].$extras.total ?? 0)
    if (amountCents > remainingCents) {
      session.flash('errors', {
        amount: `Il ne reste que ${formatEuros(Math.max(remainingCents, 0))} à allouer (prix : ${formatEuros(wish.priceCents)}).`,
      })
      return response.redirect().back()
    }
    await Allocation.create({ wishId: wish.id, fundingSourceId, amountCents })
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async destroy({ params, response }: HttpContext) {
    const allocation = await Allocation.findOrFail(params.id)
    const wishId = allocation.wishId
    await allocation.delete()
    return response.redirect().toRoute('wishes.show', { id: wishId })
  }
}
