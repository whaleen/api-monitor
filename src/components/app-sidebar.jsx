// src/components/app-sidebar.jsx
import { useState } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar({ methods, setActiveMethod, activeMethod, calls }) {
  // Track open/closed state for each domain
  const [openDomains, setOpenDomains] = useState(new Set())

  // Group calls by domain
  const domainGroups = calls.reduce((acc, call) => {
    const domain = call.domain
    if (!acc[domain]) {
      acc[domain] = {
        methods: new Set(),
        calls: [],
        isAnalytics: call.isAnalytics || false,
      }
    }
    acc[domain].methods.add(call.method)
    acc[domain].calls.push(call)
    return acc
  }, {})

  const toggleDomain = (domain) => {
    setOpenDomains((prev) => {
      const next = new Set(prev)
      if (next.has(domain)) {
        next.delete(domain)
      } else {
        next.add(domain)
      }
      return next
    })
  }

  function getRootDomain(domain) {
    try {
      // Split by dots and get last two parts
      const parts = domain.split('.')
      if (parts.length > 2) {
        return parts.slice(-2).join('.')
      }
      return domain
    } catch {
      return domain
    }
  }

  function getFavicon(domain) {
    const rootDomain = getRootDomain(domain)
    return `https://www.google.com/s2/favicons?domain=${rootDomain}`
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
            >
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold'>api-monitor</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {Object.entries(domainGroups).map(([domain, data]) => (
              <SidebarMenuItem key={domain}>
                <SidebarMenuButton
                  onClick={() => toggleDomain(domain)}
                  className='font-medium flex items-center gap-2'
                >
                  <img
                    src={getFavicon(domain)}
                    alt={`${domain} favicon`}
                    className='w-4 h-4'
                    onError={(e) => {
                      e.target.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`
                    }}
                  />
                  {domain} {data.isAnalytics && '(Analytics)'} (
                  {data.calls.length})
                </SidebarMenuButton>
                {openDomains.has(domain) && (
                  <SidebarMenuSub>
                    {Array.from(data.methods).map((method) => (
                      <SidebarMenuSubItem key={`${domain}-${method}`}>
                        <SidebarMenuSubButton
                          onClick={() => setActiveMethod(method)}
                          isActive={method === activeMethod}
                        >
                          {method} (
                          {data.calls.filter((c) => c.method === method).length}
                          )
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
