import type { HttpContext } from '@adonisjs/core/http'
import FundingSource from '#models/funding_source'
import MonthlyTransfer from '#models/monthly_transfer'
import { monthlyTransferValidator } from '#validators/monthly_transfer'
import { toCents } from '#services/money'

export default class MonthlyTransfersController {
  async store({ request, response, session }: HttpContext) {
    const { fromSourceId, toSourceId, amount } =
      await request.validateUsing(monthlyTransferValidator)
    if (fromSourceId === toSourceId) {
      session.flash('errors', { toSourceId: 'Les deux comptes doivent être différents.' })
      return response.redirect().back()
    }
    await Promise.all([
      FundingSource.findOrFail(fromSourceId),
      FundingSource.findOrFail(toSourceId),
    ])
    await MonthlyTransfer.create({ fromSourceId, toSourceId, amountCents: toCents(amount) })
    return response.redirect().toRoute('sources.index')
  }

  async destroy({ params, response }: HttpContext) {
    const transfer = await MonthlyTransfer.findOrFail(params.id)
    await transfer.delete()
    return response.redirect().toRoute('sources.index')
  }
}
