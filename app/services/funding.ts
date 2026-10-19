import { DateTime } from 'luxon'

// Le strict nécessaire : un Wish Lucid (avec allocations préchargées) convient, un objet simple aussi
export interface FundingInput {
  priceCents: number
  fundingMode: 'monthly' | 'deadline'
  allocations: { amountCents: number | null; monthlyCents: number | null }[]
}

export interface FundingSummary {
  fundedCents: number
  monthlyCents: number
  remainingCents: number
  progress: number
  covered: boolean
  // Mode mensualités : nombre de mois restants et date estimée d'achat
  monthsLeft: number | null
  estimatedDate: string | null
}

/**
 * Calcule l'état du financement d'une envie.
 * Les allocations doivent être préchargées (wish.allocations).
 * Un prix à 0 est considéré comme déjà couvert (rien à financer).
 * - amountCents : montant déjà mis de côté / prévu ponctuellement
 * - monthlyCents : montant mensuel alloué (mode mensualités)
 */
export function summarize(wish: FundingInput): FundingSummary {
  const fundedCents = wish.allocations.reduce((sum, a) => sum + (a.amountCents ?? 0), 0)
  const monthlyCents = wish.allocations.reduce((sum, a) => sum + (a.monthlyCents ?? 0), 0)
  const remainingCents = Math.max(wish.priceCents - fundedCents, 0)
  const covered = remainingCents === 0
  const progress = wish.priceCents > 0 ? Math.min(fundedCents / wish.priceCents, 1) : 0

  let monthsLeft: number | null = null
  let estimatedDate: string | null = null
  if (wish.fundingMode === 'monthly') {
    if (covered) {
      monthsLeft = 0
      estimatedDate = DateTime.now().toISODate()
    } else if (monthlyCents > 0) {
      monthsLeft = Math.ceil(remainingCents / monthlyCents)
      estimatedDate = DateTime.now().plus({ months: monthsLeft }).toISODate()
    }
  }

  return { fundedCents, monthlyCents, remainingCents, progress, covered, monthsLeft, estimatedDate }
}

export const toCents = (euros: number) => Math.round(euros * 100)
