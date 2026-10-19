import vine from '@vinejs/vine'

// amount (échéance) ou monthly (mensualités), en euros. Au moins un des deux est requis.
export const allocationValidator = vine.compile(
  vine.object({
    fundingSourceId: vine.number().positive(),
    amount: vine.number().positive().max(1_000_000).optional().requiredIfMissing('monthly'),
    monthly: vine.number().positive().max(100_000).optional().requiredIfMissing('amount'),
    availableOn: vine.date().optional(),
  })
)
