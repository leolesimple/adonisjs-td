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
import { Textarea } from '~/components/ui/textarea'
import { a11y } from '~/lib/a11y'
import { priorityLabels, statusLabels, type WishData } from '~/lib/format'

type TextField = 'name' | 'category' | 'url' | 'imageUrl'

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }))

// Le formulaire vit dans DialogContent : il est recréé à chaque ouverture, donc toujours à jour
function WishForm({ wish, onDone }: { wish: WishData | null; onDone: () => void }) {
  const form = useForm({
    name: wish?.name ?? '',
    price: wish ? String(wish.priceCents / 100) : '',
    category: wish?.category ?? '',
    priority: wish?.priority ?? 'medium',
    url: wish?.url ?? '',
    imageUrl: wish?.imageUrl ?? '',
    notes: wish?.notes ?? '',
    status: wish?.status ?? 'wished',
    targetDate: wish?.targetDate ?? '',
  })
  const { data, errors, setData } = form

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (wish) form.put(`/wishes/${wish.id}`, { onSuccess: onDone })
    else form.post('/wishes', { onSuccess: onDone })
  }

  const textField = (name: TextField, label: string, type = 'text') => (
    <Field id={name} label={label} error={errors[name]}>
      <Input
        {...a11y(name, errors[name])}
        type={type}
        value={data[name]}
        onChange={(e) => setData(name, e.target.value)}
      />
    </Field>
  )

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {textField('name', 'Nom')}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="price" label="Prix (€)" error={errors.price}>
          <Input
            {...a11y('price', errors.price)}
            type="number"
            step="0.01"
            min="0"
            value={data.price}
            onChange={(e) => setData('price', e.target.value)}
          />
        </Field>
        {textField('category', 'Catégorie')}
        <SelectField
          id="priority"
          label="Priorité"
          value={data.priority}
          onChange={(v) => setData('priority', v as WishData['priority'])}
          options={toOptions(priorityLabels)}
          error={errors.priority}
        />
        <SelectField
          id="status"
          label="Statut"
          value={data.status}
          onChange={(v) => setData('status', v as WishData['status'])}
          options={toOptions(statusLabels)}
          error={errors.status}
        />
      </div>
      <Field
        id="targetDate"
        label="Date cible (facultatif)"
        error={errors.targetDate}
        hint="La projection dira si tu la tiens."
      >
        <Input
          {...a11y('targetDate', errors.targetDate)}
          type="date"
          value={data.targetDate}
          onChange={(e) => setData('targetDate', e.target.value)}
        />
      </Field>
      {textField('url', 'Lien du produit', 'url')}
      {textField('imageUrl', "URL de l'image", 'url')}
      <Field id="notes" label="Notes" error={errors.notes}>
        <Textarea
          {...a11y('notes', errors.notes)}
          rows={3}
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
  wish: WishData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WishFormDialog({ wish, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{wish ? `Modifier ${wish.name}` : 'Nouvelle envie'}</DialogTitle>
          <DialogDescription>
            {wish ? "Change les informations de l'envie." : 'Ajoute une envie à ta wishlist.'}
          </DialogDescription>
        </DialogHeader>
        <WishForm wish={wish} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
