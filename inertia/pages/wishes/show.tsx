import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import AllocationDialog from '~/components/allocation-dialog'
import ConfirmDialog from '~/components/confirm-dialog'
import Layout from '~/components/layout'
import WishFormDialog from '~/components/wish-form-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatDate, formatEuros, priorityLabels, statusLabels, type WishData } from '~/lib/format'

interface AllocationData {
  id: number
  fundingSourceId: number
  fundingSourceName: string
  amountCents: number | null
  monthlyCents: number | null
  availableOn: string | null
}

export default function Show({
  wish,
  sources,
}: {
  wish: WishData & { allocations: AllocationData[] }
  sources: { id: number; name: string }[]
}) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<AllocationData | null>(null)
  const f = wish.funding

  return (
    <Layout title={wish.name}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/wishes">
          <ArrowLeft /> Toutes les envies
        </Link>
      </Button>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{wish.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil /> Modifier
          </Button>
          <Button variant="outline" className="text-destructive" onClick={() => setDeleting(true)}>
            <Trash2 /> Supprimer
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{statusLabels[wish.status]}</Badge>
        <Badge variant="outline">Priorité {priorityLabels[wish.priority].toLowerCase()}</Badge>
        {wish.category && <Badge variant="outline">{wish.category}</Badge>}
        {wish.url && (
          <a
            className="ml-2 text-sm underline underline-offset-4"
            href={wish.url}
            target="_blank"
            rel="noreferrer"
          >
            Voir le produit
          </a>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-3">
          <div className="flex justify-between text-sm">
            <span>
              {formatEuros(f.fundedCents)} sur {formatEuros(wish.priceCents)}
            </span>
            <strong>{Math.round(f.progress * 100)} %</strong>
          </div>
          <Progress value={Math.round(f.progress * 100)} aria-label="Progression du financement" />
          {f.covered ? (
            <p className="font-medium text-success">Entièrement financé.</p>
          ) : wish.fundingMode === 'monthly' ? (
            f.estimatedDate ? (
              <p>
                Il reste {formatEuros(f.remainingCents)}. Avec {formatEuros(f.monthlyCents)} par
                mois, achat estimé dans {f.monthsLeft} mois, le {formatDate(f.estimatedDate)}.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Il reste {formatEuros(f.remainingCents)}. Ajoute une mensualité pour estimer la
                date.
              </p>
            )
          ) : (
            <p className="font-medium text-destructive">
              Il manque {formatEuros(f.remainingCents)}
              {wish.targetDate ? ` avant le ${formatDate(wish.targetDate)}` : ''}.
            </p>
          )}
        </CardContent>
      </Card>

      {wish.notes && <p className="mb-6">{wish.notes}</p>}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Financement</h2>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> Ajouter
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Déjà alloué</TableHead>
              <TableHead>Par mois</TableHead>
              <TableHead>Disponible le</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wish.allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  Aucune allocation.
                </TableCell>
              </TableRow>
            )}
            {wish.allocations.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.fundingSourceName}</TableCell>
                <TableCell>{a.amountCents ? formatEuros(a.amountCents) : ''}</TableCell>
                <TableCell>{a.monthlyCents ? formatEuros(a.monthlyCents) : ''}</TableCell>
                <TableCell>{formatDate(a.availableOn)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setRemoving(a)}
                  >
                    Retirer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <WishFormDialog wish={wish} open={editing} onOpenChange={setEditing} />
      <AllocationDialog wish={wish} sources={sources} open={adding} onOpenChange={setAdding} />
      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title={`Supprimer « ${wish.name} » ?`}
        description="L'envie et ses allocations seront supprimées. Cette action est définitive."
        onConfirm={() => router.delete(`/wishes/${wish.id}`)}
      />
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Retirer cette allocation ?"
        description={`L'argent de « ${removing?.fundingSourceName ?? ''} » ne sera plus compté pour cette envie.`}
        confirmLabel="Retirer"
        onConfirm={() => removing && router.delete(`/allocations/${removing.id}`)}
      />
    </Layout>
  )
}
