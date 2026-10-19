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

interface Props {
  wish: { id: number; name: string }
  sources: { id: number; name: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AllocationForm({
  wish,
  sources,
  onDone,
}: Omit<Props, 'open' | 'onOpenChange'> & { onDone: () => void }) {
  const form = useForm({ fundingSourceId: '', amount: '' })
  const { data, errors, setData } = form

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post(`/wishes/${wish.id}/allocations`, { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <SelectField
        id="fundingSourceId"
        label="Compte"
        value={data.fundingSourceId}
        onChange={(v) => setData('fundingSourceId', v)}
        options={sources.map((s) => ({ value: String(s.id), label: s.name }))}
        placeholder="Choisir un compte"
        error={errors.fundingSourceId}
      />
      <Field
        id="amount"
        label="Montant prélevé (€)"
        error={errors.amount}
        hint="La somme des allocations doit couvrir le prix de l'envie."
      >
        <Input
          {...a11y('amount', errors.amount)}
          type="number"
          step="0.01"
          min="0"
          value={data.amount}
          onChange={(e) => setData('amount', e.target.value)}
        />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={form.processing}>
          Ajouter
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AllocationDialog({ wish, sources, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une allocation</DialogTitle>
          <DialogDescription>
            Sur quel compte « {wish.name} » prélève-t-elle de l'argent ?
          </DialogDescription>
        </DialogHeader>
        <AllocationForm wish={wish} sources={sources} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
