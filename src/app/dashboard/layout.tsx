import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClerkLoaded, ClerkLoading  } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 relative">
          <SidebarTrigger />
          <ClerkLoading>
            <Loader2 className="flex items-center justify-center ml-50 mt-50 h-10 w-10 animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </main>
      </div>
    </SidebarProvider>
  );
}
