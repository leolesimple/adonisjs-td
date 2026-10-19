import { Link, router, useForm } from '@inertiajs/react'
import Field from '~/components/field'
import Layout from '~/components/layout'
import { a11y } from '~/lib/a11y'
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
  const form = useForm({ fundingSourceId: '', amount: '', monthly: '', availableOn: '' })
  const { data, errors, setData } = form
  const f = wish.funding

  const addAllocation = (e: React.FormEvent) => {
    e.preventDefault()
    form.post(`/wishes/${wish.id}/allocations`, { onSuccess: () => form.reset() })
  }

  const remove = () => {
    if (confirm(`Supprimer « ${wish.name} » ?`)) router.delete(`/wishes/${wish.id}`)
  }

  return (
    <Layout title={wish.name}>
      <div className="hstack justify-content-between mb-3">
        <h1 className="h3 mb-0">{wish.name}</h1>
        <div className="hstack gap-2">
          <Link className="btn btn-subtle theme-secondary" href={`/wishes/${wish.id}/edit`}>
            Modifier
          </Link>
          <button className="btn btn-subtle theme-danger" onClick={remove}>
            Supprimer
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className="badge badge-subtle theme-secondary me-1">{statusLabels[wish.status]}</span>
        <span className="badge badge-subtle theme-info me-1">
          Priorité {priorityLabels[wish.priority].toLowerCase()}
        </span>
        {wish.category && (
          <span className="badge badge-outline theme-secondary">{wish.category}</span>
        )}
        {wish.url && (
          <a className="ms-2" href={wish.url} target="_blank" rel="noreferrer">
            Voir le produit
          </a>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="hstack justify-content-between mb-2">
            <span>
              {formatEuros(f.fundedCents)} sur {formatEuros(wish.priceCents)}
            </span>
            <strong>{Math.round(f.progress * 100)} %</strong>
          </div>
          <div
            className="progress mb-3"
            role="progressbar"
            aria-label="Progression du financement"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(wish.funding.progress * 100)}
          >
            <div className="progress-bar" style={{ width: `${f.progress * 100}%` }} />
          </div>
          {f.covered ? (
            <div className="alert theme-success mb-0">Entièrement financé.</div>
          ) : wish.fundingMode === 'monthly' ? (
            f.estimatedDate ? (
              <p className="mb-0">
                Il reste {formatEuros(f.remainingCents)}. Avec {formatEuros(f.monthlyCents)} par
                mois, achat estimé dans {f.monthsLeft} mois, le {formatDate(f.estimatedDate)}.
              </p>
            ) : (
              <p className="mb-0 text-muted">
                Il reste {formatEuros(f.remainingCents)}. Ajoute une mensualité pour estimer la
                date.
              </p>
            )
          ) : (
            <div className="alert theme-warning mb-0">
              Il manque {formatEuros(f.remainingCents)}
              {wish.targetDate ? ` avant le ${formatDate(wish.targetDate)}` : ''}.
            </div>
          )}
        </div>
      </div>

      {wish.notes && <p className="mb-4">{wish.notes}</p>}

      <h2 className="h5 mb-3">Financement</h2>
      <div className="table-responsive mb-4">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">Déjà alloué</th>
              <th scope="col">Par mois</th>
              <th scope="col">Disponible le</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {wish.allocations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted">
                  Aucune allocation.
                </td>
              </tr>
            )}
            {wish.allocations.map((a) => (
              <tr key={a.id}>
                <td>{a.fundingSourceName}</td>
                <td>{a.amountCents ? formatEuros(a.amountCents) : ''}</td>
                <td>{a.monthlyCents ? formatEuros(a.monthlyCents) : ''}</td>
                <td>{formatDate(a.availableOn)}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-subtle theme-danger"
                    onClick={() => router.delete(`/allocations/${a.id}`)}
                  >
                    Retirer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={addAllocation} className="card" noValidate>
        <div className="card-body">
          <h3 className="h6 mb-3">Ajouter une allocation</h3>
          {sources.length === 0 ? (
            <p className="text-muted mb-0">
              Crée d'abord une <Link href="/sources">source de financement</Link>.
            </p>
          ) : (
            <div className="vstack gap-3">
              <Field id="fundingSourceId" label="Source" error={errors.fundingSourceId}>
                <select
                  {...a11y('fundingSourceId', errors.fundingSourceId)}
                  className="form-control form-control-caret"
                  value={data.fundingSourceId}
                  onChange={(e) => setData('fundingSourceId', e.target.value)}
                >
                  <option value="">Choisir…</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="amount"
                label={wish.fundingMode === 'deadline' ? 'Montant (€)' : 'Déjà mis de côté (€)'}
                error={errors.amount}
              >
                <input
                  {...a11y('amount', errors.amount)}
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={data.amount}
                  onChange={(e) => setData('amount', e.target.value)}
                />
              </Field>
              {wish.fundingMode === 'monthly' ? (
                <Field id="monthly" label="Mis de côté chaque mois (€)" error={errors.monthly}>
                  <input
                    {...a11y('monthly', errors.monthly)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={data.monthly}
                    onChange={(e) => setData('monthly', e.target.value)}
                  />
                </Field>
              ) : (
                <Field id="availableOn" label="Disponible le (ex. paie)" error={errors.availableOn}>
                  <input
                    {...a11y('availableOn', errors.availableOn)}
                    type="date"
                    className="form-control"
                    value={data.availableOn}
                    onChange={(e) => setData('availableOn', e.target.value)}
                  />
                </Field>
              )}
              <div>
                <button
                  type="submit"
                  className="btn btn-solid theme-primary"
                  disabled={form.processing}
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Layout>
  )
}
