"use client";

import { type Icon } from "@tabler/icons-react";
import { Mail, UserPlus, Users } from "lucide-react";
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
      icon: <Users />,
    },

    {
      title: "Add Friends",
      url: "/dashboard/friends/add",
      icon: <UserPlus />,
    },
    {
      title: "Invites",
      url: "/dashboard/friends/invites",

      icon: <Mail />,
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
                            <SidebarMenuButton>
                              {item.icon}
                              {item.title}
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
