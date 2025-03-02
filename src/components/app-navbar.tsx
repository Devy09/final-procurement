"use client";

import { Bell, ChevronsUpDown, UserCog, Moon, Sun, LogOut, BellOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/signout-button";

interface UserProps {
  userData: {
    clerkId?: string;
    fullName: string;
    email: string;
    imageUrl?: string;
    section?: string;
    designation?: string;
  };
}

export function AppNavBar({ userData }: UserProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-2 p-2">
            <p className="text-sm text-muted-foreground text-center">No new notifications</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-auto p-4 bg-white/80 dark:bg-red-950/80 backdrop-blur-sm hover:bg-red-950 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-medium leading-none text-black dark:text-white group-hover:text-white transition-colors">
                  {userData.section}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  {userData.designation}
                </p>
              </div>
              <Avatar>
                <AvatarImage src={userData.imageUrl} alt={userData.fullName} className="w-10 h-10"/>
                <AvatarFallback>
                  {userData.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {theme !== "light" && (
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
            )}
            {theme !== "dark" && (
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notification
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}