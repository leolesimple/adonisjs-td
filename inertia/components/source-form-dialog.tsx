import { useForm } from '@inertiajs/react'
import Field from '~/components/field'
import SelectField from '~/components/select-field'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { a11y } from '~/lib/a11y'
import { sourceTypeLabels } from '~/lib/format'

export type SourceType = keyof typeof sourceTypeLabels

export interface SourceData {
  id: number
  name: string
  type: SourceType
  notes: string | null
  monthlyCents: number
  allocatedCents: number
}

function SourceForm({ source, onDone }: { source: SourceData | null; onDone: () => void }) {
  const form = useForm({
    name: source?.name ?? '',
    type: source?.type ?? ('savings' as SourceType),
    notes: source?.notes ?? '',
  })
  const { data, errors, setData } = form

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (source) form.put(`/sources/${source.id}`, { onSuccess: onDone })
    else form.post('/sources', { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Field id="name" label="Nom" error={errors.name}>
        <Input
          {...a11y('name', errors.name)}
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
      </Field>
      <SelectField
        id="type"
        label="Type"
        value={data.type}
        onChange={(v) => setData('type', v as SourceType)}
        options={Object.entries(sourceTypeLabels).map(([value, label]) => ({ value, label }))}
        error={errors.type}
      />
      <Field id="notes" label="Notes" error={errors.notes}>
        <Input
          {...a11y('notes', errors.notes)}
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
        />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={form.processing}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  )
}

interface Props {
  source: SourceData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SourceFormDialog({ source, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{source ? `Modifier ${source.name}` : 'Nouvelle source'}</DialogTitle>
          <DialogDescription>
            D'où vient l'argent : Livret A, compte chèque, paie…
          </DialogDescription>
        </DialogHeader>
        <SourceForm source={source} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
