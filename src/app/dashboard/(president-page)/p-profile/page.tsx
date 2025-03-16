"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Building, Building2, UserRoundCog, Loader2, Save, SquareArrowOutUpRight, Signature } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "../../../../hooks/use-toast";
import { Toaster } from "../../../../components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";

export default function PresidentProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const [userData, setUserData] = useState({
    title: "",
    section: "",
    designation: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile/${user?.id}`, {
          method: "GET",
        });

        if (response.ok) {
          const profile = await response.json();
            setUserData({
            title: profile.title || "",
            section: profile.section || "",
            designation: profile.designation || "",
          });
          setSignature(profile.signatureUrl || null);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch profile.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Error fetching profile.",
          variant: "destructive",
        });
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleSave = async () => {
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
          role: user?.publicMetadata?.role,
          ...userData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setIsReplacing(true);
    try {
      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = async () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Remove white background
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          
          // Check if pixel is light (close to white)
          if (red > 200 && green > 200 && blue > 200) {
            // Make pixel transparent
            data[i + 3] = 0;
          }
        }

        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Get the processed image as base64
        const processedImage = canvas.toDataURL('image/png', 1.0);

        // Create form data with processed image
        const formData = new FormData();
        formData.append('signature', file);
        formData.append('userId', user?.id || '');
        formData.append('processedImage', processedImage);

        // Send to server
        const response = await fetch('/api/user/signature', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setSignature(data.signatureUrl);
          toast({
            title: "Success",
            description: "Signature uploaded successfully!",
          });
        } else {
          throw new Error('Failed to upload signature');
        }
      };

      img.src = imageUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload signature",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsReplacing(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/csugate.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col space-y-8 bg-white bg-opacity-70 rounded-lg p-6">
        <div className="flex items-center gap-6 pt-4 rounded-lg w-full">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-black font-bold">
                {user?.fullName?.charAt(0) || "A"}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-sm mt-1 font-bold">
              ROLE: {(user?.publicMetadata as { role?: string })?.role ||
                "No role available"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={loading}
              className="bg-red-950 text-white hover:bg-red-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {isEditing ? (
            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={userData.title}
                  onChange={(e) =>
                    setUserData({ ...userData, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">
                  Section
                </Label>
                <Input
                  id="section"
                  value={userData.section}
                  onChange={(e) =>
                    setUserData({ ...userData, section: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="designation" className="text-right">
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={userData.designation}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      designation: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Title :</span>
                <span className="text-foreground">{userData.title || "No title set"}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Section :</span>
                <span className="text-foreground">{userData.section || "No section set"}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <UserRoundCog className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Designation :</span>
                <span className="text-foreground">{userData.designation || "No designation set"}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                It is recommended to use a transparent background for the signature. Visit <a href="https://www.remove.bg/" target="_blank" className="text-blue-500 underline">remove.bg</a> to remove the background of your signature.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-red-950 text-white hover:bg-red-900">
                    <Signature className="mr-2 h-4 w-4" />
                    Add Signature
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="bg-red-950 text-white p-6 rounded-lg">
                    <DialogTitle>Upload Signature</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {signature ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <img
                            src={signature}
                            alt="Current Signature"
                            className="max-w-full h-auto"
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            className="w-full bg-red-950 text-white hover:bg-red-900" 
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files) {
                                  setIsReplacing(true);
                                  handleSignatureUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
                                }
                              };
                              input.click();
                            }}
                            disabled={isReplacing}
                          >
                            {isReplacing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Replacing...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Replace Signature
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="signature">Signature Image</Label>
                        <Input
                          id="signature"
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          disabled={isUploading}
                        />
                        {isUploading && (
                          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading signature...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
