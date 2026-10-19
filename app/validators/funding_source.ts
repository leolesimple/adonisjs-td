import vine from '@vinejs/vine'

export const fundingSourceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80),
    type: vine.enum(['savings', 'checking', 'income'] as const),
    notes: vine.string().trim().maxLength(500).optional(),
  })
)
