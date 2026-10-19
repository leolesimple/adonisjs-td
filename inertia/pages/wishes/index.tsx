import { Link } from '@inertiajs/react'
import Layout from '~/components/layout'
import { formatDate, formatEuros, priorityLabels, statusLabels, type WishData } from '~/lib/format'

export default function Index({
  wishes,
  status,
}: {
  wishes: WishData[]
  status: keyof typeof statusLabels | null
}) {
  const total = wishes.reduce((sum, w) => sum + w.priceCents, 0)
  const funded = wishes.reduce((sum, w) => sum + w.funding.fundedCents, 0)

  return (
    <Layout title="Envies">
      <div className="hstack justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">Mes envies</h1>
          <p className="text-muted mb-0">
            {formatEuros(funded)} financés sur {formatEuros(total)}
          </p>
        </div>
        <Link className="btn btn-solid theme-primary" href="/wishes/create">
          Nouvelle envie
        </Link>
      </div>

      <div className="nav nav-pills mb-4">
        <Link className={`nav-link${!status ? ' active' : ''}`} href="/wishes">
          Toutes
        </Link>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Link
            key={key}
            className={`nav-link${status === key ? ' active' : ''}`}
            href={`/wishes?status=${key}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {wishes.length === 0 && <p className="text-muted">Aucune envie pour l'instant.</p>}

      <div className="vstack gap-3">
        {wishes.map((wish) => (
          <Link key={wish.id} href={`/wishes/${wish.id}`} className="card text-decoration-none">
            <div className="card-body">
              <div className="hstack justify-content-between mb-2">
                <div>
                  <h2 className="h5 mb-1">{wish.name}</h2>
                  <span className="badge badge-subtle theme-secondary me-1">
                    {statusLabels[wish.status]}
                  </span>
                  <span className="badge badge-subtle theme-info me-1">
                    Priorité {priorityLabels[wish.priority].toLowerCase()}
                  </span>
                  {wish.category && (
                    <span className="badge badge-outline theme-secondary">{wish.category}</span>
                  )}
                </div>
                <strong>{formatEuros(wish.priceCents)}</strong>
              </div>
              <div
                className="progress mb-2"
                role="progressbar"
                aria-label="Progression du financement"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(wish.funding.progress * 100)}
              >
                <div
                  className="progress-bar"
                  style={{ width: `${wish.funding.progress * 100}%` }}
                />
              </div>
              <small className="text-muted">
                {formatEuros(wish.funding.fundedCents)} réunis
                {wish.fundingMode === 'monthly' && wish.funding.estimatedDate
                  ? ` · achat estimé ${formatDate(wish.funding.estimatedDate)}`
                  : ''}
                {wish.fundingMode === 'deadline' && wish.targetDate
                  ? ` · avant le ${formatDate(wish.targetDate)}`
                  : ''}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
