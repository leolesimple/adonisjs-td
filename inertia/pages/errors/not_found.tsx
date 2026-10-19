import { Link } from '@inertiajs/react'
import Layout from '~/components/layout'

export default function NotFound() {
  return (
    <Layout title="Page introuvable">
      <h1 className="h3">Page introuvable</h1>
      <p className="text-muted">Cette page n'existe pas ou a été supprimée.</p>
      <Link className="btn btn-solid theme-primary" href="/wishes">
        Retour aux envies
      </Link>
    </Layout>
  )
}
