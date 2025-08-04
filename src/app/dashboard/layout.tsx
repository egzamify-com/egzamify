"use client";
import { usePathname } from "next/navigation";
import type React from "react";
import { Suspense, useEffect } from "react";
import { AppSidebar } from "~/components/dashboardSidebar/app-sidebar";
import { SiteHeader } from "~/components/dashboardSidebar/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { updateDashboardBreadcrumbs } from "~/lib/stores/breadcrumbsStore";

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
        {/* <div className="flex flex-1 flex-col">{children}</div> */}
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
        <Suspense fallback={null}>
          <DashbboardBreadcrumbs />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
function DashbboardBreadcrumbs() {
  const pathname = usePathname();
  useEffect(() => {
    switch (pathname) {
      case "/dashboard/teoria":
        updateDashboardBreadcrumbs("Egzamin Teoretyczny");
        break;
      case "/dashboard/praktyka":
        updateDashboardBreadcrumbs("Egzamin Praktyczny");
        break;
      case "/dashboard":
        updateDashboardBreadcrumbs("Witaj!");
      case "/dashboard/ai-wyjasnia":
        updateDashboardBreadcrumbs("AI Wyjaśnienia");
        break;
    }
  }, [pathname]);
  return null;
}
