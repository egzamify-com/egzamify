"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import type { NavbarItem } from "./app-sidebar"

export function NavMain({ items }: { items: NavbarItem[] }) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <NavbarItem key={item.url} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
function NavbarItemCore({
  item: { url, icon, title, badgeComponent },
}: {
  item: NavbarItem
}) {
  return (
    // @ts-expect-error fix todo
    <Link href={url}>
      <SidebarMenuButton className="flex flex-row items-center justify-between text-sm">
        <div className="flex flex-row items-center gap-2">
          {icon}
          {title}
        </div>
        <div>{badgeComponent && <>{badgeComponent}</>}</div>
      </SidebarMenuButton>
    </Link>
  )
}

function NavbarItem({ item }: { item: NavbarItem }) {
  if (item.childrenItems) {
    return (
      <CollapsibleNavbarItem
        items={item.childrenItems}
        icon={item.icon}
        title={item.title}
      />
    )
  }
  return (
    <SidebarMenuItem>
      <NavbarItemCore item={item} />
    </SidebarMenuItem>
  )
}

function CollapsibleNavbarItem({
  items,
  title,
  icon,
}: {
  title: string
  icon: React.ReactNode
  items: NavbarItem[]
}) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex flex-row items-center justify-between text-sm">
            <div className="flex flex-row items-center gap-2">
              {icon}
              {title}
            </div>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => {
              return (
                <SidebarMenuSubItem key={`collabsiblesidebar-${item.url}`}>
                  <NavbarItemCore item={item} />{" "}
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
