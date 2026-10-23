import vine from '@vinejs/vine'

export const allocationValidator = vine.create(
  vine.object({
    fundingSourceId: vine.number().positive(),
    amount: vine.number().min(0.01).max(1_000_000),
  })
)
