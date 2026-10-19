import { Link } from '@adonisjs/inertia/react'
import Layout from '~/components/layout'
import { Button } from '~/components/ui/button'

export default function ServerError() {
  return (
    <Layout title="Erreur serveur">
      <h1 className="mb-2 text-2xl font-semibold">Erreur serveur</h1>
      <p className="mb-4 text-muted-foreground">
        Quelque chose s'est mal passé de notre côté. Réessaie dans un instant.
      </p>
      <Button asChild>
        <Link route="wishes.index">Retour aux envies</Link>
      </Button>
    </Layout>
  )
}
