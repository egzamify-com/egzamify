"use client";

import { IconListDetails, type Icon } from "@tabler/icons-react";
import { History, Mail, Text, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import InvitesNavBadge from "../friends/invites-nav-badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const friendsTab = [
    {
      title: "My Friends",
      url: "/dashboard/friends",
      icon: <Users size={18} />,
    },

    {
      title: "Add Friends",
      url: "/dashboard/friends/add",
      icon: <UserPlus size={18} />,
    },
    {
      title: "Invites",
      url: "/dashboard/friends/invites",
      icon: <Mail size={18} />,
      badgeComponent: <InvitesNavBadge />,
    },
  ];
  const AiWyjasniaTab = [
    {
      title: "Start a conversation",
      url: "/dashboard/ai-wyjasnia",
      icon: <IconListDetails size={18} />,
    },
    {
      title: "Chat History",
      url: "/dashboard/ai-wyjasnia/history",
      icon: <History size={18} />,
    },
  ];
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <Link href={item.url} key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Users /> Friends
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {friendsTab.map((item) => {
                      return (
                        <Link key={item.title} href={`${item.url}`}>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton className="flex flex-row justify-between">
                              <div className="flex flex-row items-center justify-center gap-2 text-sm">
                                {item.icon}
                                {item.title}
                              </div>
                              <div>
                                {item.badgeComponent && (
                                  <>{item.badgeComponent}</>
                                )}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </Link>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Text /> Ai Conversation
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {AiWyjasniaTab.map((item) => {
                      return (
                        <Link key={item.title} href={`${item.url}`}>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton className="flex flex-row justify-between">
                              <div className="flex flex-row items-center justify-center gap-2 text-sm">
                                {item.icon}
                                {item.title}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </Link>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
