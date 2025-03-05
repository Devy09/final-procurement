'use client';
import { SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn || !user) return;
  
    // Define role routes with type safety
    const roleRoutes = {
      ADMIN: "/dashboard",
      PROCUREMENT_OFFICER: "/dashboard/procurement-dashboard",
      ACCOUNTANT: "/dashboard/accountant-dashboard",
      PRESIDENT: "/dashboard/president-dashboard",
      OFFICE_HEAD: "/dashboard/officehead-dashboard",
      BAC: "/dashboard/bac-dashboard",
    } as const;
  
    // Type assertion + runtime check
    const role = user.publicMetadata?.role as keyof typeof roleRoutes | undefined;
    
    if (role && role in roleRoutes) {
      router.push(roleRoutes[role]);
    } else {
      router.push("/dashboard"); // Fallback for unknown roles
    }
  }, [isSignedIn, user, router]);

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center mt-20">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-red-500 hover:bg-red-600", // Custom styling
          }
        }}
      />
    </div>
  );
}