import { Link, useForm } from '@inertiajs/react'
import Field from '~/components/field'
import Layout from '~/components/layout'
import { a11y } from '~/lib/a11y'
import { priorityLabels, statusLabels, type WishData } from '~/lib/format'

type TextField = 'name' | 'category' | 'url' | 'imageUrl'

export default function Form({ wish }: { wish: WishData | null }) {
  const form = useForm({
    name: wish?.name ?? '',
    price: wish ? String(wish.priceCents / 100) : '',
    category: wish?.category ?? '',
    priority: wish?.priority ?? 'medium',
    url: wish?.url ?? '',
    imageUrl: wish?.imageUrl ?? '',
    notes: wish?.notes ?? '',
    status: wish?.status ?? 'wished',
    fundingMode: wish?.fundingMode ?? 'monthly',
    targetDate: wish?.targetDate ?? '',
  })
  const { data, errors, setData } = form

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (wish) form.put(`/wishes/${wish.id}`)
    else form.post('/wishes')
  }

  const textField = (name: TextField, label: string, type = 'text') => (
    <Field id={name} label={label} error={errors[name]}>
      <input
        {...a11y(name, errors[name])}
        type={type}
        className="form-control"
        value={data[name]}
        onChange={(e) => setData(name, e.target.value)}
      />
    </Field>
  )

  return (
    <Layout title={wish ? 'Modifier une envie' : 'Nouvelle envie'}>
      <h1 className="h3 mb-4">{wish ? `Modifier ${wish.name}` : 'Nouvelle envie'}</h1>
      <form onSubmit={submit} className="vstack gap-3" style={{ maxWidth: 640 }} noValidate>
        {textField('name', 'Nom')}

        <Field id="price" label="Prix (€)" error={errors.price}>
          <input
            {...a11y('price', errors.price)}
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={data.price}
            onChange={(e) => setData('price', e.target.value)}
          />
        </Field>

        {textField('category', 'Catégorie')}

        <Field id="priority" label="Priorité" error={errors.priority}>
          <select
            {...a11y('priority', errors.priority)}
            className="form-control form-control-caret"
            value={data.priority}
            onChange={(e) => setData('priority', e.target.value as WishData['priority'])}
          >
            {Object.entries(priorityLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field id="status" label="Statut" error={errors.status}>
          <select
            {...a11y('status', errors.status)}
            className="form-control form-control-caret"
            value={data.status}
            onChange={(e) => setData('status', e.target.value as WishData['status'])}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="fundingMode"
          label="Mode de financement"
          error={errors.fundingMode}
          hint="Mensualités : la date d'achat est estimée. Échéance : tu fixes la date à tenir."
        >
          <select
            {...a11y('fundingMode', errors.fundingMode)}
            className="form-control form-control-caret"
            value={data.fundingMode}
            onChange={(e) => setData('fundingMode', e.target.value as WishData['fundingMode'])}
          >
            <option value="monthly">Mensualités</option>
            <option value="deadline">Échéance</option>
          </select>
        </Field>

        {data.fundingMode === 'deadline' && (
          <Field id="targetDate" label="Date à tenir" error={errors.targetDate}>
            <input
              {...a11y('targetDate', errors.targetDate)}
              type="date"
              className="form-control"
              value={data.targetDate}
              onChange={(e) => setData('targetDate', e.target.value)}
            />
          </Field>
        )}

        {textField('url', 'Lien du produit', 'url')}
        {textField('imageUrl', "URL de l'image", 'url')}

        <Field id="notes" label="Notes" error={errors.notes}>
          <textarea
            {...a11y('notes', errors.notes)}
            rows={3}
            className="form-control"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
          />
        </Field>

        <div className="hstack gap-2">
          <button type="submit" className="btn btn-solid theme-primary" disabled={form.processing}>
            Enregistrer
          </button>
          <Link
            className="btn btn-subtle theme-secondary"
            href={wish ? `/wishes/${wish.id}` : '/wishes'}
          >
            Annuler
          </Link>
        </div>
      </form>
    </Layout>
  )
}
