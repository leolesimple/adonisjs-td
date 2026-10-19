import { Link } from '@inertiajs/react'
import Layout from '~/components/layout'

export default function ServerError(props: { error: { message: string } }) {
  return (
    <Layout title="Erreur serveur">
      <h1 className="h3">Erreur serveur</h1>
      <p className="text-muted">{props.error.message}</p>
      <Link className="btn btn-solid theme-primary" href="/wishes">
        Retour aux envies
      </Link>
    </Layout>
  )
}
