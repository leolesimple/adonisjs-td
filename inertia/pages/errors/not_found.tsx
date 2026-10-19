import { Link } from '@adonisjs/inertia/react'
import Layout from '~/components/layout'
import { Button } from '~/components/ui/button'

export default function NotFound() {
  return (
    <Layout title="Page introuvable">
      <h1 className="mb-2 text-2xl font-semibold">Page introuvable</h1>
      <p className="mb-4 text-muted-foreground">Cette page n'existe pas ou a été supprimée.</p>
      <Button asChild>
        <Link route="wishes.index">Retour aux envies</Link>
      </Button>
    </Layout>
  )
}
