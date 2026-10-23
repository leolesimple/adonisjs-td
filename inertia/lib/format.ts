const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatEuros = (cents: number) => euros.format(cents / 100)

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

export const priorityLabels = { low: 'Basse', medium: 'Moyenne', high: 'Haute' } as const
export const statusLabels = {
  wished: 'Envie',
  funding: 'En financement',
  bought: 'Acheté',
  dropped: 'Abandonné',
} as const
export const sourceTypeLabels = {
  savings: 'Épargne',
  checking: 'Compte courant',
  income: 'Revenu',
} as const

export type WishProjection = {
  wishId: number
  state: 'ready' | 'planned' | 'unallocated' | 'beyond'
  allocatedCents: number
  missingCents: number
  month: number | null
  date: string | null
  onTime: boolean | null
}

export type WishData = {
  id: number
  name: string
  priceCents: number
  category: string | null
  priority: keyof typeof priorityLabels
  rank: number
  url: string | null
  imageUrl: string | null
  notes: string | null
  status: keyof typeof statusLabels
  targetDate: string | null
  allocatedCents: number
  projection: WishProjection | null
}
