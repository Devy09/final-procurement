"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface UserProps {
  userData: {
    section?: string;
    designation?: string;
  };
}

export function AppNavBar({ userData }: UserProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <div className="bg-white/80 dark:bg-red-950/80 backdrop-blur-sm px-4 py-2 rounded-md">
        <p className="text-sm font-medium leading-none text-black dark:text-white">
          {userData.section || 'No Section'}
        </p>
        <p className="text-xs text-muted-foreground">
          {userData.designation || 'No Designation'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              rootBox: "h-9 w-9",
              avatarBox: "h-9 w-9"
            }
          }}
        />
      </div>
    </div>
  );
}