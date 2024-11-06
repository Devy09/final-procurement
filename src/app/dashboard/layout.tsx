import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 relative">
          <SidebarTrigger />
          <ClerkLoading>
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
              <Loader className="animate-spin mb-4" size={150} />
              <p className="text-lg font-medium text-gray-600">
                Loading, please wait...
              </p>
            </div>
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </main>
      </div>
    </SidebarProvider>
  );
}
