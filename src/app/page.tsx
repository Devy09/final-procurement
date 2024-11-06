import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 bg-background">
        <div className="flex items-center space-x-3">
          <Image src="/transcsu.png" alt="CSU Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">CSU Procurement</h1>
        </div>
        <SignInButton>
          <Button>
            Sign In
          </Button>
        </SignInButton>
      </header>
      <main className="flex-grow">
        <section className="bg-muted py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Procurement Management System
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover amazing features and boost your productivity with our innovative solutions.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
