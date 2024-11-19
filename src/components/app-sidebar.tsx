"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavAdmin } from "@/components/nav-admin";
import { NavAccountant } from "@/components/nav-accountant";
import { NavPresident } from "@/components/nav-president";
import { NavOfficeHead } from "@/components/nav-officehead";
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
    url: "../../dashboard/procurement-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/procurement-dashboard" },
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

// ACCOUNTANT SIDEBAR
const navAccountant = [
  {
    title: "Dashboard",
    url: "../../dashboard/accountant-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/accountant-dashboard" },
      { title: "Requisition", url: "../../dashboard/a-requisition" },
    ],
  },
]

// PRESIDENT SIDEBAR
const navPresident = [
  {
    title: "Dashboard",
    url: "../../dashboard/president-overview",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/president-overview" },
      { title: "Requisition", url: "../../dashboard/president-requisition" },
    ],
  },
]

// OFFICE HEAD SIDEBAR
const navOfficeHead = [
  {
    title: "Dashboard",
    url: "../../dashboard/officehead-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/officehead-dashboard" },
      { title: "Requisition", url: "../../dashboard/officehead-requisition" },
      { title: "PPMP", url: "../../dashboard/officehead-ppmp" },
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
    title: "Archive",
    url: "#",
    icon: ArchiveRestore,
    items: [
      { title: "Restore", url: "#" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  if (!user) return null;

  const { fullName, imageUrl, emailAddresses } = user;
  const primaryEmail = emailAddresses[0]?.emailAddress || "No email available";
  const userRole = user.publicMetadata.role as string;

  const renderNavigation = () => {
    switch(userRole) {
      case 'ADMIN':
        return (
          <>
            <NavAdmin items={navAdmin} />
            <NavMain items={navMain} />
            <NavAccountant items={navAccountant} />
            <NavPresident items={navPresident} />
            <NavOfficeHead items={navOfficeHead} />
          </>
        );
      case 'PROCUREMENT_OFFICER':
        return <NavMain items={navMain} />;
      case 'OFFICE_HEAD':
        return <NavOfficeHead items={navOfficeHead} />;
      case 'ACCOUNTANT':
        return <NavAccountant items={navAccountant} />;
      case 'PRESIDENT':
        return <NavPresident items={navPresident} />;
      default:
        return null;
    }
  };

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
        {renderNavigation()}
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
