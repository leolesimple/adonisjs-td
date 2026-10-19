import vine from '@vinejs/vine'

// Montants en euros : convertis en centimes dans le contrôleur.
// income / budget / payDay ne concernent que le compte courant (champs optionnels).
export const fundingSourceValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80),
    type: vine.enum(['savings', 'checking', 'income'] as const),
    notes: vine.string().trim().maxLength(500).optional(),
    balance: vine.number().min(0).max(10_000_000),
    monthlyIncome: vine.number().min(0).max(1_000_000).optional(),
    monthlyBudget: vine.number().min(0).max(1_000_000).optional(),
    payDay: vine.number().withoutDecimals().min(1).max(28).optional(),
  })
)
