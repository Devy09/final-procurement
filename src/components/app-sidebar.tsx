"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavAdmin } from "@/components/nav-admin";
import { NavAccountant } from "@/components/nav-accountant";
import { NavPresident } from "@/components/nav-president";
import { NavOfficeHead } from "@/components/nav-officehead";
import { NavBac } from "@/components/nav-bac";
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
  FileCheck,
  University,
  FilePenLine,
  LayoutDashboard,
  Settings,
  FileBadge,
  Package,
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "Backup and Restore", url: "../../dashboard/backup-restore-page" },
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
    ],
  },
  {
    title: "PPMP",
    url: "#",
    icon: Package,
    items: [
      { title: "PPMP List", url: "../../dashboard/p-ppmp" },
    ],
  },
  {
    title: "Offices Requisitions",
    url: "#",
    icon: FileText,
    items: [
      { title: "Purchase Request", url: "../../dashboard/p-requisition" },
    ],
  },
  {
    title: "Quotations",
    url: "#",
    icon: FilePenLine,
    items: [
      { title: "Offices Quotations", url: "../../dashboard/offices-quotation" },
    ],
  },
  {
    title: "Purchase Orders",
    url: "#",
    icon: FileBadge,
    items: [
      { title: "PO Issuance", url: "../../dashboard/purchase-order" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "Profile", url: "../../dashboard/profile"},
      { title: "Maintenance", url: "#" },
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
    ],
  },
  {
    title: "Procurement Approvals",
    url: "#",
    icon: FileCheck,
    items: [
      { title: "Requisition", url: "../../dashboard/a-requisition" },
      { title: "Purchase Order", url: "../../dashboard/a-purchase-order" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "Profile", url: "../../dashboard/a-profile"},
    ],
  },
]

// PRESIDENT SIDEBAR
const navPresident = [
  {
    title: "Dashboard",
    url: "../../dashboard/president-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/president-dashboard" },
    ],
  },
  {
    title: "Procurement Approvals",
    url: "#",
    icon: FileCheck,
    items: [
      { title: "Requisition", url: "../../dashboard/president-requisition" },
      { title: "Purchase Order", url: "../../dashboard/p-purchase-order" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "Profile", url: "../../dashboard/p-profile"},
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
    ],
  },
  {
    title: "PPMP",
    url: "#",
    icon: FileCheck,
    items: [
      { title: "PPMP List", url: "../../dashboard/officehead-ppmp" },
    ],
  },
  {
    title: "Office Requisitions",
    url: "#",
    icon: FileText,
    items: [
      { title: "Purchase Request", url: "../../dashboard/officehead-requisition" },
    ],
  },
  {
    title: "Purchase Orders",
    url: "#",
    icon: FileBadge,
    items: [
      { title: "PO Issuance", url: "../../dashboard/officehead-po" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "Profile", url: "../../dashboard/officehead-profile"},
    ],
  },
]

// BAC OFFICE SIDEBAR
const navBac = [
  {
    title: "Dashboard",
    url: "../../dashboard/bac-dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "../../dashboard/bac-dashboard" },
    ],
  },
  {
    title: "Abstract Of Bids",
    url: "#",
    icon: FileBadge,
    items: [
      { title: "Supplier Quotations", url: "../../dashboard/supplier-quotations" },
    ],
  },
]

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
            <NavBac items={navBac} />
          </>
        );
      case 'PROCUREMENT_OFFICER':
        return <>
         <NavMain items={navMain} />
        </>
      case 'BAC':
        return <NavBac items={navBac} />;
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
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {renderNavigation()}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
