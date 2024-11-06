"use client";

import { useRouter } from 'next/navigation';

import { 
  Bell, 
  ChevronsUpDown, 
  LogOut, 
  UserCog
} from "lucide-react";

import { 
  SignedIn, 
  UserButton, 
  SignOutButton, 
  useUser 
} from "@clerk/nextjs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface UserProps {
  userData: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ userData }: UserProps) {
  const { user } = useUser(); // Fetch user data from Clerk
  const { isMobile } = useSidebar();
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('dashboard/profile');
  }

  if (!user) return null; // Handle case where user data is not loaded

  const { fullName, imageUrl, emailAddresses } = user;
  const primaryEmail = emailAddresses[0]?.emailAddress || "No email available";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={imageUrl} alt={fullName || "User"} />
                <AvatarFallback className="rounded-lg">DP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {fullName || "Anonymous User"}
                </span>
                <span className="truncate text-xs">{primaryEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {fullName || "Anonymous User"}
                  </span>
                  <span className="truncate text-xs">{primaryEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={navigateToProfile}>
                <UserCog />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LogOut />
              <SignOutButton>
                <button>Logout</button>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
