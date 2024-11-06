'use client';

import { useEffect, useState } from 'react';
import ProfileForm from "../profile/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Briefcase, Building2, FileSpreadsheet, UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`Wait, why you can login???: ${response.statusText}`);
        }

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error('Invalid JSON response from the server');
        }

        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6 animate-fadeIn">
      <Card className="w-full max-w-3xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || "User"} />
              <AvatarFallback>{user?.fullName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user?.fullname || "Anonymous"}</CardTitle>
              <p className="text-muted-foreground">{user?.email || "No email provided"}</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-40 transition-all duration-300 ease-in-out hover:scale-105">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information below.
                </DialogDescription>
              </DialogHeader>
              <ProfileForm user={user} />
              <DialogFooter className="flex justify-end">
                <Button type="submit" form="profile-form">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileDetail icon={<Briefcase className="w-5 h-5" />} label="Department" value={user?.department || "N/A"} />
          <ProfileDetail icon={<Building2 className="w-5 h-5" />} label="Section" value={user?.section || "N/A"} />
          <ProfileDetail icon={<FileSpreadsheet className="w-5 h-5" />} label="ALOBS No." value={user?.alobsNo || "N/A"} />
          <ProfileDetail icon={<FileSpreadsheet className="w-5 h-5" />} label="SAI No." value={user?.saiNo || "N/A"} />
          <ProfileDetail icon={<UserCircle2 className="w-5 h-5" />} label="Role" value={user?.role || "N/A"} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-100">
      {icon}
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-10">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    </div>
  );
}
