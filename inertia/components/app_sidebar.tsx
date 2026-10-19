import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { CalendarRange, Gift, Landmark } from 'lucide-react'
import { urlFor } from '~/client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '~/components/ui/sidebar'

// Chaque entrée pointe vers une route nommée (voir start/routes.ts)
const items = [
  { title: 'Envies', route: 'wishes.index', icon: Gift },
  { title: 'Comptes', route: 'sources.index', icon: Landmark },
  { title: 'Projection', route: 'projection.index', icon: CalendarRange },
] as const

export default function AppSidebar() {
  const { url } = usePage()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1 text-lg font-semibold group-data-[collapsible=icon]:hidden">
          Wishlist
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.route}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={url.startsWith(urlFor(item.route))}
                  >
                    <Link route={item.route}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
