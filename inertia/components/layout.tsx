import type { ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import AppSidebar from '~/components/app-sidebar'
import { Separator } from '~/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'

// Coque de toutes les pages : sidebar rétractable, en-tête avec le titre, contenu
export default function Layout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <Head title={title} />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger aria-label="Afficher ou masquer le menu" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <span className="font-medium">{title}</span>
        </header>
        <main className="mx-auto w-full max-w-5xl p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
