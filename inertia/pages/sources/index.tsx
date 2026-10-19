import { useState } from 'react'
import { router } from '@inertiajs/react'
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react'
import ConfirmDialog from '~/components/confirm-dialog'
import Layout from '~/components/layout'
import SourceFormDialog, { type SourceData } from '~/components/source-form-dialog'
import TransferDialog from '~/components/transfer-dialog'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatEuros, sourceTypeLabels } from '~/lib/format'

interface TransferData {
  id: number
  fromSourceName: string
  toSourceName: string
  amountCents: number
}

export default function Index({
  sources,
  transfers,
}: {
  sources: SourceData[]
  transfers: TransferData[]
}) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<SourceData | null>(null)
  const [deleting, setDeleting] = useState<SourceData | null>(null)
  const [addingTransfer, setAddingTransfer] = useState(false)
  const [removingTransfer, setRemovingTransfer] = useState<TransferData | null>(null)

  return (
    <Layout title="Comptes">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Comptes</h1>
          <p className="text-sm text-muted-foreground">
            D'où vient l'argent des envies : compte courant, Livret A…
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus /> Nouveau compte
        </Button>
      </div>

      <Card className="mb-10 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead>Budget envies / mois</TableHead>
              <TableHead>Alloué aux envies</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  Aucun compte pour l'instant.
                </TableCell>
              </TableRow>
            )}
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>
                  {source.name}
                  {source.payDay !== null && (
                    <span className="block text-sm text-muted-foreground">
                      Paie le {source.payDay}
                      {source.monthlyIncomeCents !== null &&
                        ` · ${formatEuros(source.monthlyIncomeCents)}`}
                    </span>
                  )}
                </TableCell>
                <TableCell>{sourceTypeLabels[source.type]}</TableCell>
                <TableCell>{formatEuros(source.balanceCents)}</TableCell>
                <TableCell>
                  {source.monthlyBudgetCents !== null ? formatEuros(source.monthlyBudgetCents) : ''}
                </TableCell>
                <TableCell>{formatEuros(source.allocatedCents)}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Modifier ${source.name}`}
                    onClick={() => setEditing(source)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    aria-label={`Supprimer ${source.name}`}
                    onClick={() => setDeleting(source)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Virements mensuels</h2>
          <p className="text-sm text-muted-foreground">
            Virés à chaque paie, mais bloqués jusqu'à la paie suivante.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddingTransfer(true)} disabled={sources.length < 2}>
          <Plus /> Nouveau virement
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Virement</TableHead>
              <TableHead>Par mois</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  Aucun virement programmé.
                </TableCell>
              </TableRow>
            )}
            {transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    {transfer.fromSourceName} <ArrowRight className="size-4" aria-label="vers" />{' '}
                    {transfer.toSourceName}
                  </span>
                </TableCell>
                <TableCell>{formatEuros(transfer.amountCents)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    aria-label="Supprimer ce virement"
                    onClick={() => setRemovingTransfer(transfer)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <SourceFormDialog source={null} open={creating} onOpenChange={setCreating} />
      <SourceFormDialog
        source={editing}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <TransferDialog sources={sources} open={addingTransfer} onOpenChange={setAddingTransfer} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Supprimer « ${deleting?.name ?? ''} » ?`}
        description="Ses allocations et ses virements seront supprimés aussi. Cette action est définitive."
        onConfirm={() => deleting && router.delete(`/sources/${deleting.id}`)}
      />
      <ConfirmDialog
        open={removingTransfer !== null}
        onOpenChange={(open) => !open && setRemovingTransfer(null)}
        title="Supprimer ce virement ?"
        description={
          removingTransfer
            ? `${removingTransfer.fromSourceName} vers ${removingTransfer.toSourceName} : ${formatEuros(removingTransfer.amountCents)} par mois.`
            : ''
        }
        onConfirm={() => removingTransfer && router.delete(`/transfers/${removingTransfer.id}`)}
      />
    </Layout>
  )
}
