import vine from '@vinejs/vine'

export const monthlyTransferValidator = vine.create({
  fromSourceId: vine.number().positive(),
  toSourceId: vine.number().positive(),
  amount: vine.number().min(10).max(1_000_000),
})
