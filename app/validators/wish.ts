import vine from '@vinejs/vine'

export const wishValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  price: vine.number().min(0.01).max(1_000_000),
  category: vine.string().trim().maxLength(60).optional(),
  priority: vine.enum(['low', 'medium', 'high'] as const),
  url: vine.string().trim().url().optional(),
  imageUrl: vine.string().trim().url().optional(),
  notes: vine.string().trim().maxLength(1000).optional(),
  status: vine.enum(['wished', 'funding', 'bought', 'dropped'] as const),
  targetDate: vine.date().optional(),
})

export const wishMoveValidator = vine.create({
  direction: vine.enum(['up', 'down'] as const),
})
