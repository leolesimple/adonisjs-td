import Layout from '~/components/layout'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatDate, formatEuros, type WishProjection } from '~/lib/format'

interface MonthData {
  month: number
  date: string
  usableCents: Record<string, number>
  lockedCents: Record<string, number>
  purchases: { id: number; name: string }[]
}

interface Props {
  sources: { id: number; name: string }[]
  months: MonthData[]
  wishes: {
    id: number
    name: string
    rank: number
    priceCents: number
    projection: WishProjection | null
  }[]
}

export default function Index({ sources, months, wishes }: Props) {
  // On s'arrête à 2 mois après le dernier achat pour garder un tableau lisible
  const lastPurchase = months.reduce((last, m) => (m.purchases.length > 0 ? m.month : last), 0)
  const visible = months.filter((m) => m.month <= Math.max(lastPurchase + 2, 6))

  return (
    <Layout title="Projection">
      <h1 className="mb-1 text-2xl font-semibold">Projection</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Argent utilisable sur chaque compte à chaque paie. Les virements du mois sont bloqués
        jusqu'à la paie suivante. Les envies sont servies par rang.
      </p>

      <h2 className="mb-3 text-lg font-semibold">Dates d'achat</h2>
      <Card className="mb-8 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rang</TableHead>
              <TableHead>Envie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Résultat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wishes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Aucune envie à financer.
                </TableCell>
              </TableRow>
            )}
            {wishes.map((wish) => (
              <TableRow key={wish.id}>
                <TableCell>{wish.rank}</TableCell>
                <TableCell>{wish.name}</TableCell>
                <TableCell>{formatEuros(wish.priceCents)}</TableCell>
                <TableCell>
                  {wish.projection?.state === 'ready' && "Dès aujourd'hui"}
                  {wish.projection?.state === 'planned' && formatDate(wish.projection.date)}
                  {wish.projection?.state === 'unallocated' &&
                    `Il manque ${formatEuros(wish.projection.missingCents)} d'allocations`}
                  {wish.projection?.state === 'beyond' && 'Au-delà de 24 mois'}
                  {wish.projection?.onTime === false && (
                    <Badge variant="outline" className="ml-2 text-destructive">
                      Après la date cible
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Mois par mois</h2>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {sources.map((source) => (
                <TableHead key={source.id}>{source.name}</TableHead>
              ))}
              <TableHead>Achats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((m) => (
              <TableRow key={m.month}>
                <TableCell className="whitespace-nowrap">
                  {m.month === 0 ? "Aujourd'hui" : formatDate(m.date)}
                </TableCell>
                {sources.map((source) => (
                  <TableCell key={source.id}>
                    {formatEuros(m.usableCents[source.id] ?? 0)}
                    {(m.lockedCents[source.id] ?? 0) > 0 && (
                      <span className="block text-xs text-muted-foreground">
                        + {formatEuros(m.lockedCents[source.id])} bloqués
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {m.purchases.map((p) => (
                    <Badge key={p.id} variant="secondary" className="mr-1">
                      {p.name}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Layout>
  )
}
