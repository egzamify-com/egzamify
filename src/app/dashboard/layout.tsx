"use client"

import type React from "react"
import { AppSidebar } from "~/components/dashboard/dashboard-sidebar/app-sidebar"
import { SiteHeader } from "~/components/dashboard/dashboard-sidebar/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"

export default function LayoutDashboard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
