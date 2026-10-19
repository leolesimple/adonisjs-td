import { useForm } from '@inertiajs/react'
import { urlFor } from '~/client'
import Field from '~/components/field'
import SelectField from '~/components/select_field'
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

export type SourceData = {
  id: number
  name: string
  type: SourceType
  notes: string | null
  balanceCents: number
  monthlyIncomeCents: number | null
  monthlyBudgetCents: number | null
  payDay: number | null
  allocatedCents: number
}

const euros = (cents: number | null) => (cents === null ? '' : String(cents / 100))

function SourceForm({ source, onDone }: { source: SourceData | null; onDone: () => void }) {
  const form = useForm({
    name: source?.name ?? '',
    type: source?.type ?? ('savings' as SourceType),
    notes: source?.notes ?? '',
    balance: source ? euros(source.balanceCents) : '0',
    monthlyIncome: euros(source?.monthlyIncomeCents ?? null),
    monthlyBudget: euros(source?.monthlyBudgetCents ?? null),
    payDay: source?.payDay === null || source?.payDay === undefined ? '' : String(source.payDay),
  })
  const { data, errors, setData } = form

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (source) form.put(urlFor('sources.update', { id: source.id }), { onSuccess: onDone })
    else form.post(urlFor('sources.store'), { onSuccess: onDone })
  }

  const amountField = (
    name: 'balance' | 'monthlyIncome' | 'monthlyBudget',
    label: string,
    hint?: string
  ) => (
    <Field id={name} label={label} error={errors[name]} hint={hint}>
      <Input
        {...a11y(name, errors[name])}
        type="number"
        step="0.01"
        min="0"
        value={data[name]}
        onChange={(e) => setData(name, e.target.value)}
      />
    </Field>
  )

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
      {amountField(
        'balance',
        'Disponible pour les envies (€)',
        "L'argent que ce compte peut déjà consacrer aux envies."
      )}
      {data.type === 'checking' && (
        <>
          {amountField('monthlyIncome', 'Paie mensuelle (€)')}
          {amountField(
            'monthlyBudget',
            'Budget envies par mois (€)',
            'Ce que le compte ajoute aux envies à chaque paie.'
          )}
          <Field id="payDay" label="Jour de paie (1 à 28)" error={errors.payDay}>
            <Input
              {...a11y('payDay', errors.payDay)}
              type="number"
              min="1"
              max="28"
              value={data.payDay}
              onChange={(e) => setData('payDay', e.target.value)}
            />
          </Field>
        </>
      )}
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

type Props = {
  source: SourceData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SourceFormDialog({ source, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{source ? `Modifier ${source.name}` : 'Nouveau compte'}</DialogTitle>
          <DialogDescription>
            Un compte qui finance tes envies : compte courant, Livret A…
          </DialogDescription>
        </DialogHeader>
        <SourceForm source={source} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
