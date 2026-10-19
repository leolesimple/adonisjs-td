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
  sources: { id: number; name: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TransferForm({ sources, onDone }: { sources: Props['sources']; onDone: () => void }) {
  const form = useForm({ fromSourceId: '', toSourceId: '', amount: '' })
  const { data, errors, setData } = form
  const options = sources.map((s) => ({ value: String(s.id), label: s.name }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/transfers', { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <SelectField
        id="fromSourceId"
        label="Depuis le compte"
        value={data.fromSourceId}
        onChange={(v) => setData('fromSourceId', v)}
        options={options}
        placeholder="Choisir un compte"
        error={errors.fromSourceId}
      />
      <SelectField
        id="toSourceId"
        label="Vers le compte"
        value={data.toSourceId}
        onChange={(v) => setData('toSourceId', v)}
        options={options}
        placeholder="Choisir un compte"
        error={errors.toSourceId}
      />
      <Field
        id="amount"
        label="Montant par mois (€)"
        error={errors.amount}
        hint="Viré à chaque paie, utilisable à la paie suivante."
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

export default function TransferDialog({ sources, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau virement mensuel</DialogTitle>
          <DialogDescription>
            Par exemple du compte courant vers le Livret A, chaque mois.
          </DialogDescription>
        </DialogHeader>
        <TransferForm sources={sources} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
