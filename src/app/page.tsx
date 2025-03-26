"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import {
  Moon,
  Sun,
  Signature,
  FileText,
  MapPin,
  FileSpreadsheet,
  Upload,
  Handshake,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";

export default function Home() {
  const { setTheme } = useTheme();
  const clerk = useClerk();
  console.log("Clerk context:", clerk);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed w-full z-10 bg-[#800000]/80 backdrop-blur-sm">
        <div className="mx-auto flex justify-between items-center py-4 px-4 md:px-8 lg:px-12">
          {/* Left side: Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Procurement Management System</h1>
          </div>

          {/* Right side: Theme Toggle and Login Button */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SignInButton 
              fallbackRedirectUrl="/dashboard" 
              forceRedirectUrl="/dashboard"
            >
              <Button>Login</Button>
            </SignInButton>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative bg-muted py-40 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/csugate.jpg"
              alt="University Campus Background"
              fill
              priority
              className="object-cover opacity-50"
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 ml-80">
              <Image
                src="/transcsu.png"
                alt="CSU Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <p className="text-2xl font-extrabold tracking-tight">
              Cotabato State University
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Procurement Management System
            </h2>
            <p className="text-xl tracking-tight">
              Streamline university procurement processes. Enhance efficiency
              and reduce manual process.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Signature,
                  title: "Digital Approval / E-Signature",
                  description:
                    "Expedite procurement requests with secure digital signatures and approvals",
                },
                {
                  icon: FileText,
                  title: "Streamline Workflows",
                  description:
                    "Optimize procurement processes, from creation of PR to issuance of Purchase Order",
                },
                {
                  icon: MapPin,
                  title: "Document Tracking",
                  description:
                    "Real-time tracking and management of all procurement-related documents",
                },
                {
                  icon: FileSpreadsheet,
                  title: "Generate Forms",
                  description:
                    "Automatically create and manage forms for procurement transactions",
                },
                {
                  icon: Upload,
                  title: "PPMP",
                  description:
                    "Easily manage Project Procurement Management Plans (PPMP)",
                },
                {
                  icon: Handshake,
                  title: "Abstract of Bids",
                  description: "Easily manage Abstract of Bids for Bidding",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-muted rounded-lg"
                >
                  <feature.icon className="w-12 h-12 mb-4 text-primary" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-8">
              Trusted Across University Departments
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {[
                { name: "CETC", logo: "/cetc-logo.png" },
                { name: "CAS", logo: "/cas-logo.png" },
                { name: "CBPA", logo: "/cbpa-logo.png" },
                { name: "CTED", logo: "/cted-logo.png" },
                { name: "CAFI", logo: "/cafi-logo.png" },
                { name: "CAFO", logo: "/cafo-logo.png" },
                { name: "CIS", logo: "/cis-logo.png" },
                { name: "Graduate School", logo: "/grad-school.png" },
              ].map((dept, i) => (
                <div
                  key={i}
                  className="bg-background rounded-lg p-4 shadow-md flex flex-col items-center"
                >
                  <Image
                    src={dept.logo}
                    alt={`${dept.name} Logo`}
                    width={180}
                    height={180}
                  />
                  <p className="font-semibold text-lg">{dept.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Cotabato State University
            Procurement Management System. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            This system is exclusively for authorized CSU staff use.
          </p>
        </div>
      </footer>
    </div>
  );
}
