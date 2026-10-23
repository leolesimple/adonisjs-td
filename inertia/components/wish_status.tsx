import type { WishData } from '~/lib/format'
import { formatDate, formatEuros } from '~/lib/format'

export default function WishStatus({ wish }: { wish: WishData }) {
  const p = wish.projection
  if (!p) return null

  if (p.state === 'unallocated') {
    return (
      <p className="text-sm text-muted-foreground">
        Il manque {formatEuros(p.missingCents)} d'allocations pour couvrir le prix.
      </p>
    )
  }
  if (p.state === 'beyond') {
    return <p className="text-sm text-destructive">Pas finançable dans les 24 prochains mois.</p>
  }

  const when =
    p.state === 'ready' ? "Finançable dès aujourd'hui" : `Achat possible le ${formatDate(p.date)}`
  return (
    <p className="text-sm">
      <span className="font-medium">{when}</span>
      {p.onTime === true && (
        <span className="text-success"> · à temps pour le {formatDate(wish.targetDate)}</span>
      )}
      {p.onTime === false && (
        <span className="text-destructive">
          {' '}
          · après la date cible du {formatDate(wish.targetDate)}
        </span>
      )}
    </p>
  )
}
