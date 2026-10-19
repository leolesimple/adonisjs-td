import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import Layout from '~/components/layout'
import WishStatus from '~/components/wish-status'
import WishFormDialog from '~/components/wish-form-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatEuros, priorityLabels, statusLabels, type WishData } from '~/lib/format'

export default function Index({
  wishes,
  status,
}: {
  wishes: WishData[]
  status: keyof typeof statusLabels | null
}) {
  const [creating, setCreating] = useState(false)
  const total = wishes.reduce((sum, w) => sum + w.priceCents, 0)
  const allocated = wishes.reduce((sum, w) => sum + w.allocatedCents, 0)

  const move = (wish: WishData, direction: 'up' | 'down') =>
    router.post(`/wishes/${wish.id}/move`, { direction }, { preserveScroll: true })

  return (
    <Layout title="Envies">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mes envies</h1>
          <p className="text-sm text-muted-foreground">
            {formatEuros(allocated)} alloués sur {formatEuros(total)}. Le rang décide de l'ordre de
            financement.
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

      <ol className="grid gap-3">
        {wishes.map((wish, index) => (
          <li key={wish.id} className="flex items-stretch gap-2">
            <div className="flex flex-col items-center justify-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label={`Monter ${wish.name}`}
                disabled={index === 0}
                onClick={() => move(wish, 'up')}
              >
                <ChevronUp />
              </Button>
              <span className="text-sm font-semibold tabular-nums" title="Rang de financement">
                {wish.rank}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label={`Descendre ${wish.name}`}
                disabled={index === wishes.length - 1}
                onClick={() => move(wish, 'down')}
              >
                <ChevronDown />
              </Button>
            </div>
            <Link
              href={`/wishes/${wish.id}`}
              className="flex-1 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Card className="h-full transition-colors hover:bg-accent/50">
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
                    value={
                      wish.priceCents > 0
                        ? Math.min(100, Math.round((wish.allocatedCents / wish.priceCents) * 100))
                        : 0
                    }
                    aria-label="Part du prix couverte par les allocations"
                  />
                  <WishStatus wish={wish} />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ol>

      <WishFormDialog wish={null} open={creating} onOpenChange={setCreating} />
    </Layout>
  )
}
