import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import Layout from '~/components/layout'
import WishFormDialog from '~/components/wish-form-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatDate, formatEuros, priorityLabels, statusLabels, type WishData } from '~/lib/format'

export default function Index({
  wishes,
  status,
}: {
  wishes: WishData[]
  status: keyof typeof statusLabels | null
}) {
  const [creating, setCreating] = useState(false)
  const total = wishes.reduce((sum, w) => sum + w.priceCents, 0)
  const funded = wishes.reduce((sum, w) => sum + w.funding.fundedCents, 0)

  return (
    <Layout title="Envies">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mes envies</h1>
          <p className="text-sm text-muted-foreground">
            {formatEuros(funded)} financés sur {formatEuros(total)}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus /> Nouvelle envie
        </Button>
      </div>

      <nav aria-label="Filtrer par statut" className="mb-6 flex flex-wrap gap-2">
        <Button asChild size="sm" variant={status ? 'outline' : 'default'}>
          <Link href="/wishes">Toutes</Link>
        </Button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Button key={key} asChild size="sm" variant={status === key ? 'default' : 'outline'}>
            <Link href={`/wishes?status=${key}`}>{label}</Link>
          </Button>
        ))}
      </nav>

      {wishes.length === 0 && <p className="text-muted-foreground">Aucune envie pour l'instant.</p>}

      <div className="grid gap-3">
        {wishes.map((wish) => (
          <Link
            key={wish.id}
            href={`/wishes/${wish.id}`}
            className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-2">
                    <h2 className="font-semibold">{wish.name}</h2>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{statusLabels[wish.status]}</Badge>
                      <Badge variant="outline">
                        Priorité {priorityLabels[wish.priority].toLowerCase()}
                      </Badge>
                      {wish.category && <Badge variant="outline">{wish.category}</Badge>}
                    </div>
                  </div>
                  <strong className="whitespace-nowrap">{formatEuros(wish.priceCents)}</strong>
                </div>
                <Progress
                  value={Math.round(wish.funding.progress * 100)}
                  aria-label="Progression du financement"
                />
                <p className="text-sm text-muted-foreground">
                  {formatEuros(wish.funding.fundedCents)} réunis
                  {wish.fundingMode === 'monthly' && wish.funding.estimatedDate
                    ? ` · achat estimé ${formatDate(wish.funding.estimatedDate)}`
                    : ''}
                  {wish.fundingMode === 'deadline' && wish.targetDate
                    ? ` · avant le ${formatDate(wish.targetDate)}`
                    : ''}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <WishFormDialog wish={null} open={creating} onOpenChange={setCreating} />
    </Layout>
  )
}
