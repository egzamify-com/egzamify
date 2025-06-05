"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AppSidebar } from "~/components/dashboardSidebar/app-sidebar";
import { SiteHeader } from "~/components/dashboardSidebar/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { updateDashboardBreadcrumbs } from "~/lib/stores/breadcrumbsStore";
import { log } from "~/utils/log";

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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
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
    log(pathname);
    switch (pathname) {
      case "/dashboard/teoria":
        updateDashboardBreadcrumbs("Egzamin Teoretyczny");
        break;
      case "/dashboard/praktyka":
        updateDashboardBreadcrumbs("Egzamin Praktyczny");
        break;
      case "/dashboard":
        updateDashboardBreadcrumbs("Witaj!");
    }
  }, [pathname]);
  return null;
}
