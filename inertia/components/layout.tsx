import type { ReactNode } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'

export default function Layout({ title, children }: { title: string; children: ReactNode }) {
  const { url } = usePage()
  const link = (href: string, label: string) => (
    <Link className={`nav-link${url.startsWith(href) ? ' active' : ''}`} href={href}>
      {label}
    </Link>
  )

  return (
    <>
      <Head title={title} />
      <nav className="navbar border-bottom mb-4">
        <div className="container">
          <Link className="navbar-brand fw-semibold" href="/wishes">
            Wishlist
          </Link>
          <div className="nav nav-pills">
            {link('/wishes', 'Envies')}
            {link('/sources', 'Sources')}
          </div>
        </div>
      </nav>
      <main className="container pb-5">{children}</main>
    </>
  )
}
