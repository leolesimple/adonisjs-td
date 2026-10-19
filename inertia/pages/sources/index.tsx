import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import ConfirmDialog from '~/components/confirm-dialog'
import Layout from '~/components/layout'
import SourceFormDialog, { type SourceData } from '~/components/source-form-dialog'
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

export default function Index({ sources }: { sources: SourceData[] }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<SourceData | null>(null)
  const [deleting, setDeleting] = useState<SourceData | null>(null)

  return (
    <Layout title="Sources">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Sources de financement</h1>
          <p className="text-sm text-muted-foreground">
            D'où vient l'argent : Livret A, compte chèque, paie…
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus /> Nouvelle source
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Alloué (ponctuel)</TableHead>
              <TableHead>Alloué par mois</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  Aucune source pour l'instant.
                </TableCell>
              </TableRow>
            )}
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>
                  {source.name}
                  {source.notes && (
                    <span className="block text-sm text-muted-foreground">{source.notes}</span>
                  )}
                </TableCell>
                <TableCell>{sourceTypeLabels[source.type]}</TableCell>
                <TableCell>{formatEuros(source.allocatedCents)}</TableCell>
                <TableCell>{formatEuros(source.monthlyCents)}</TableCell>
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

      <SourceFormDialog source={null} open={creating} onOpenChange={setCreating} />
      <SourceFormDialog
        source={editing}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Supprimer « ${deleting?.name ?? ''} » ?`}
        description="Ses allocations seront supprimées aussi. Cette action est définitive."
        onConfirm={() => deleting && router.delete(`/sources/${deleting.id}`)}
      />
    </Layout>
  )
}
