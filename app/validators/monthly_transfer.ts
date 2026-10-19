import vine from '@vinejs/vine'

export const monthlyTransferValidator = vine.create(
  vine.object({
    fromSourceId: vine.number().positive(),
    toSourceId: vine.number().positive(),
    // 10 € : montant minimum d'un virement en France
    amount: vine.number().min(10).max(1_000_000),
  })
)
