import type { HttpContext } from '@adonisjs/core/http'
import Allocation from '#models/allocation'
import Wish from '#models/wish'
import FundingSource from '#models/funding_source'
import { allocationValidator } from '#validators/allocation'
import { toCents } from '#services/money'

export default class AllocationsController {
  async store({ params, request, response }: HttpContext) {
    const wish = await Wish.findOrFail(params.wishId)
    const { fundingSourceId, amount } = await request.validateUsing(allocationValidator)
    // 404 plutôt qu'une erreur SQL si la source n'existe pas
    await FundingSource.findOrFail(fundingSourceId)
    await Allocation.create({ wishId: wish.id, fundingSourceId, amountCents: toCents(amount) })
    return response.redirect().toRoute('wishes.show', { id: wish.id })
  }

  async destroy({ params, response }: HttpContext) {
    const allocation = await Allocation.findOrFail(params.id)
    const wishId = allocation.wishId
    await allocation.delete()
    return response.redirect().toRoute('wishes.show', { id: wishId })
  }
}
