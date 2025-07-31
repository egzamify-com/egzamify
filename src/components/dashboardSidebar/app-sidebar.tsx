"use client";

import { IconInnerShadowTop, IconListDetails } from "@tabler/icons-react";
import {
  Check,
  Cpu,
  Hand,
  History,
  Mail,
  MessageCircle,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import InvitesNavBadge from "../friends/invites-nav-badge";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const SIDEBAR_ICON_SIZE = 18;

export type NavbarItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  badgeComponent?: React.ReactNode;
  childrenItems?: NavbarItem[];
};

const navMain: NavbarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <User size={SIDEBAR_ICON_SIZE} />,
  },

  {
    title: "Friends",
    icon: <Users size={SIDEBAR_ICON_SIZE} />,
    url: "/dashboard/friends",
    childrenItems: [
      {
        title: "My Friends",
        url: "/dashboard/friends",
        icon: <Users size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Add Friends",
        url: "/dashboard/friends/add",
        icon: <UserPlus size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Invites",
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
        title: "Start a conversation",
        url: "/dashboard/ai-wyjasnia",
        icon: <IconListDetails size={SIDEBAR_ICON_SIZE} />,
      },
      {
        title: "Chat History",
        url: "/dashboard/ai-wyjasnia/history",
        icon: <History size={SIDEBAR_ICON_SIZE} />,
      },
    ],
  },
  {
    title: "Egzamin Teoretyczny",
    url: "/dashboard/teoria",
    icon: <Check size={SIDEBAR_ICON_SIZE} />,
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
];

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
                {<IconInnerShadowTop />}
                <span className="text-base font-semibold">Nazwa</span>
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
  );
}
