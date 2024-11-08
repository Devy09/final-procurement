import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user } = useUser();
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [designation, setDesignation] = useState("");
  const [saino, setSaino] = useState("");
  const [alobsno, setAlobsno] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile/${user?.id}`, {
          method: "GET",
        });

        if (response.ok) {
          const profile = await response.json();
          setDepartment(profile.department || "");
          setSection(profile.section || "");
          setDesignation(profile.designation || "");
          setSaino(profile.saino || "");
          setAlobsno(profile.alobsno || "");
        } else {
          console.error("Failed to fetch profile.");
          toast({
            title: "Error",
            description: "Failed to fetch profile.",
            type: "background",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Error fetching profile.",
          type: "background",
        });
      }
    };

    // Fetch profile data when component mounts
    if (user?.id) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user?.id,
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          imageUrl: user?.imageUrl,
          department,
          section,
          designation,
          saino,
          alobsno,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save profile. Please try again.");
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
        type: "background",
      });
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        type: "background",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[90%] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Manage your profile settings</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-12 w-12 rounded-lg">
              {user?.imageUrl ? (
                <AvatarImage src={user.imageUrl} alt="User avatar" />
              ) : (
                <AvatarFallback className="rounded-lg">DP</AvatarFallback>
              )}
            </Avatar>
            <div className="ml-2 gap-2">
              <p className="font-semibold text-2xl text-gray-700 dark:text-gray-300">
                {user?.fullName || "Anonymous User"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {user?.primaryEmailAddress?.emailAddress || "No email available"}
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Input
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="designation" className="text-right">
                Designation
              </Label>
              <Input
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="saino" className="text-right">
                SAI No.
              </Label>
              <Input
                id="saino"
                value={saino}
                onChange={(e) => setSaino(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alobsno" className="text-right">
                Alobs no.
              </Label>
              <Input
                id="alobsno"
                value={alobsno}
                onChange={(e) => setAlobsno(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Save Profile Button with Loading */}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
        <Toaster />
      </SheetContent>
    </Sheet>
  );
}
