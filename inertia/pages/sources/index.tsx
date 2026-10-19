import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'
import Field from '~/components/field'
import Layout from '~/components/layout'
import { a11y } from '~/lib/a11y'
import { formatEuros, sourceTypeLabels } from '~/lib/format'

type SourceType = keyof typeof sourceTypeLabels

interface SourceData {
  id: number
  name: string
  type: SourceType
  notes: string | null
  monthlyCents: number
  allocatedCents: number
}

// Formulaire partagé entre la création et la modification d'une source
function SourceForm({ source, onDone }: { source?: SourceData; onDone?: () => void }) {
  const form = useForm({
    name: source?.name ?? '',
    type: source?.type ?? ('savings' as SourceType),
    notes: source?.notes ?? '',
  })
  const { data, errors, setData } = form
  const prefix = source ? `source-${source.id}` : 'new-source'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (source) form.put(`/sources/${source.id}`, { onSuccess: onDone })
    else form.post('/sources', { onSuccess: () => form.reset() })
  }

  return (
    <form onSubmit={submit} className="vstack gap-3" noValidate>
      <Field id={`${prefix}-name`} label="Nom" error={errors.name}>
        <input
          {...a11y(`${prefix}-name`, errors.name)}
          className="form-control"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-type`} label="Type" error={errors.type}>
        <select
          {...a11y(`${prefix}-type`, errors.type)}
          className="form-control form-control-caret"
          value={data.type}
          onChange={(e) => setData('type', e.target.value as SourceType)}
        >
          {Object.entries(sourceTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${prefix}-notes`} label="Notes" error={errors.notes}>
        <input
          {...a11y(`${prefix}-notes`, errors.notes)}
          className="form-control"
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
        />
      </Field>
      <div className="hstack gap-2">
        <button type="submit" className="btn btn-solid theme-primary" disabled={form.processing}>
          {source ? 'Enregistrer' : 'Ajouter'}
        </button>
        {onDone && (
          <button type="button" className="btn btn-subtle theme-secondary" onClick={onDone}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default function Index({ sources }: { sources: SourceData[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const remove = (source: SourceData) => {
    if (confirm(`Supprimer « ${source.name} » et ses allocations ?`)) {
      router.delete(`/sources/${source.id}`)
    }
  }

  return (
    <Layout title="Sources de financement">
      <h1 className="h3 mb-1">Sources de financement</h1>
      <p className="text-muted mb-4">D'où vient l'argent : Livret A, compte chèque, paie…</p>

      <div className="table-responsive mb-4">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Type</th>
              <th scope="col">Alloué (ponctuel)</th>
              <th scope="col">Alloué par mois</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted">
                  Aucune source pour l'instant.
                </td>
              </tr>
            )}
            {sources.map((source) =>
              editingId === source.id ? (
                <tr key={source.id}>
                  <td colSpan={5}>
                    <SourceForm source={source} onDone={() => setEditingId(null)} />
                  </td>
                </tr>
              ) : (
                <tr key={source.id}>
                  <td>
                    {source.name}
                    {source.notes && <small className="d-block text-muted">{source.notes}</small>}
                  </td>
                  <td>{sourceTypeLabels[source.type]}</td>
                  <td>{formatEuros(source.allocatedCents)}</td>
                  <td>{formatEuros(source.monthlyCents)}</td>
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-sm btn-subtle theme-secondary me-1"
                      onClick={() => setEditingId(source.id)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-subtle theme-danger"
                      onClick={() => remove(source)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="card-body">
          <h2 className="h6 mb-3">Nouvelle source</h2>
          <SourceForm />
        </div>
      </div>
    </Layout>
  )
}
