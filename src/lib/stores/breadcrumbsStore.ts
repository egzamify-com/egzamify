import { Store } from "@tanstack/store"

export const dashboardBreadcrumbsStore = new Store("")
export function updateDashboardBreadcrumbs(value: string) {
  dashboardBreadcrumbsStore.setState(value)
}
