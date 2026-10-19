import vine from '@vinejs/vine'

export const monthlyTransferValidator = vine.compile(
  vine.object({
    fromSourceId: vine.number().positive(),
    toSourceId: vine.number().positive(),
    amount: vine.number().min(0.01).max(1_000_000),
  })
)
