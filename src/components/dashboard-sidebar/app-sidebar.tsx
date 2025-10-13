"use client"

import {
  Calendar,
  Check,
  Cpu,
  Hand,
  History,
  Mail,
  MessageCircle,
  SquareCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import InvitesNavBadge from "../friends/invites-nav-badge"
import { Badge } from "../ui/badge"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user/nav-user"

const SIDEBAR_ICON_SIZE = 18

export type NavbarItem = {
  title: string
  url: string
  icon: React.ReactNode
  badgeComponent?: React.ReactNode
  childrenItems?: NavbarItem[]
}

const navMain: NavbarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <User size={SIDEBAR_ICON_SIZE} />,
  },

  {
    title: "Znajomi",
    icon: <Users size={SIDEBAR_ICON_SIZE} />,
    url: "/dashboard/friends",
    childrenItems: [
      {
        title: "Moi znajomi",
        url: "/dashboard/friends",
        icon: <Users size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Dodaj znajomych",
        url: "/dashboard/friends/add",
        icon: <UserPlus size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Zaproszenia",
        url: "/dashboard/friends/invites",
        icon: <Mail size={SIDEBAR_ICON_SIZE} />,
        badgeComponent: <InvitesNavBadge />,
      },
    ],
  },
  {
    title: "Ai wyjasnia",
    icon: <MessageCircle size={SIDEBAR_ICON_SIZE} />,
    url: "/dashboard/ai-wyjasnia",
    childrenItems: [
      {
        title: "Rozpocznij czat z AI",
        url: "/dashboard/ai-wyjasnia",
        icon: <Calendar size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Historia czatów",
        url: "/dashboard/ai-wyjasnia/history",
        icon: <History size={SIDEBAR_ICON_SIZE} />,
      },
    ],
  },
  {
    title: "Egzamin Teoretyczny",
    icon: <Check size={SIDEBAR_ICON_SIZE} />,
    url: "/dashboard/egzamin-teoretyczny",
    childrenItems: [
      {
        title: "Zacznij egzamin z teorii",
        icon: <SquareCheck size={SIDEBAR_ICON_SIZE} />,
        url: "/dashboard/egzamin-teoretyczny",
      },
    ],
  },
  {
    title: "Egzamin Praktyczny",
    icon: <Hand size={SIDEBAR_ICON_SIZE} />,
    url: "/dashboard/",
    childrenItems: [
      {
        title: "Zacznij egzamin z AI",
        url: "/dashboard/egzamin-praktyczny",
        icon: <Cpu size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Wykonane egzaminy",
        url: "/dashboard/egzamin-praktyczny/historia",
        icon: <History size={SIDEBAR_ICON_SIZE} />,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={"/"}>
                <div className="flex flex-row justify-start gap-2">
                  <h1 className="text-xl font-extrabold">Egzamify</h1>
                  <Badge variant={"outline"} className="rounded-xl">
                    <p className="m-0 p-0 text-xs">Beta</p>
                  </Badge>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
