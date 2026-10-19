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
  checking: 'Compte chèque',
  income: 'Revenu',
} as const

export interface Funding {
  fundedCents: number
  monthlyCents: number
  remainingCents: number
  progress: number
  covered: boolean
  monthsLeft: number | null
  estimatedDate: string | null
}

export interface WishData {
  id: number
  name: string
  priceCents: number
  category: string | null
  priority: keyof typeof priorityLabels
  url: string | null
  imageUrl: string | null
  notes: string | null
  status: keyof typeof statusLabels
  fundingMode: 'monthly' | 'deadline'
  targetDate: string | null
  funding: Funding
}
