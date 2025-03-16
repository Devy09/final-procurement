import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppNavBar } from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import prisma from "@/lib/prisma";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  
  const dbUser = user ? await prisma.user.findUnique({
    where: {
      clerkId: user.id
    },
    select: {
      section: true,
      designation: true
    }
  }) : null;

  const userData = user ? {
    clerkId: user.id,
    fullName: user.fullName || '',
    email: user.emailAddresses[0]?.emailAddress || '',
    imageUrl: user.imageUrl,
    section: dbUser?.section || 'No Section',
    designation: dbUser?.designation || 'No Designation',
  } : null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="flex justify-between items-center pt-4 px-4">
            <SidebarTrigger />
            <AppNavBar userData={userData!} />
          </div>
          <div className="pt-2">
            <ClerkLoading>
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-20 w-20 animate-spin text-red-950 drop-shadow-lg" />
                  <p className="text-2xl text-muted-foreground">Loading, please wait...</p>
                </div>
              </div>
            </ClerkLoading>
            <ClerkLoaded>{children}</ClerkLoaded>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
