"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavAdmin } from "@/components/nav-admin";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Files,
  FileCheck,
  University,
  FilePenLine,
  LayoutDashboard,
  ArchiveRestore,
} from "lucide-react";


// ADMIN SIDEBAR
const navAdmin = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "User Management", url: "../../dashboard/user-management" },
    ],
  },
]

// PROCUREMENT OFFICER SIDEBAR
const navMain = [
  {
    title: "Dashboard",
    url: "dashboard/procurement-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Requisition", url: "../../dashboard/p-requisition" },
      { title: "PPMP", url: "../../dashboard/p-ppmp" },
    ],
  },
  {
    title: "Quotations",
    url: "#",
    icon: FilePenLine,
    items: [
      { title: "Offices Quotations", url: "#" },
      { title: "Supplier Quotations", url: "#" },
      { title: "Abstract of Bids", url: "#" },
    ],
  },
  {
    title: "Purchase Orders",
    url: "#",
    icon: FileCheck,
    items: [
      { title: "Purchase Order", url: "#" },
    ],
  },
  {
    title: "Documents",
    url: "#",
    icon: Files,
    items: [
      { title: "Location", url: "#" },
    ],
  },
  {
    title: "Archive",
    url: "#",
    icon: ArchiveRestore,
    items: [
      { title: "Restore", url: "#" },
    ],
  },
];



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser(); // Fetch user data from Clerk

  if (!user) return null;

  const { fullName, imageUrl, emailAddresses } = user;
  const primaryEmail = emailAddresses[0]?.emailAddress || "No email available";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <University className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CSU</span>
                  <span className="truncate text-xs">Procurement</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavAdmin items={navAdmin} />
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          userData={{
            fullName: fullName || "Anonymous User",
            email: primaryEmail,
            imageUrl: imageUrl,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
