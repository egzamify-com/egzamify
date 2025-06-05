import { Store } from "@tanstack/store";

export const dashboardBreadcrumbsStore = new Store("");
export function updateDashboardBreadcrumbs(value: string) {
  dashboardBreadcrumbsStore.setState(value);
}
// console.log(countStore.state); // 0
// countStore.setState(() => 1);
// console.log(countStore.state); // 1
