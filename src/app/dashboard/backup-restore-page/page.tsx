"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  FolderSync,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const BackupRestorePage = () => {
  const [status, setStatus] = useState<"idle" | "backing-up" | "restoring-users" | "restoring-all" | "success">("idle")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)

  const handleBackup = async () => {
    try {
      setStatus("backing-up")

      const response = await fetch("/api/admin-api/backup-restore-api/backup")

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create backup");
      }

      // Get the response blob
      const blob = await response.blob();
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastBackupDate(new Date().toLocaleString())
      setStatus("success");
      toast({
        title: "Backup Created",
        description: "Your backup has been downloaded successfully",
      });
    } catch (error) {
      setStatus("idle");
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: error instanceof Error ? error.message : "An error occurred while creating backup",
      });
    }
  };

  const handleRestoreUsers = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a backup file first",
      });
      return;
    }

    try {
      setStatus("restoring-users");
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('action', 'users');

      const response = await fetch("/api/admin-api/backup-restore-api/restore", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to restore users");
      }

      setStatus("success");
      toast({
        title: "Users Restored",
        description: `Successfully restored ${responseData.usersRestored} users`,
      });
    } catch (error) {
      setStatus("idle");
      toast({
        variant: "destructive",
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "An error occurred while restoring users",
      });
    }
  };

  const handleRestoreAll = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a backup file first",
      });
      return;
    }

    try {
      setStatus("restoring-all");
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('action', 'all');

      const response = await fetch("/api/admin-api/backup-restore-api/restore", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to restore data");
      }

      setStatus("success");
      toast({
        title: "Data Restored",
        description: "Successfully restored all data",
      });
    } catch (error) {
      setStatus("idle");
      toast({
        variant: "destructive",
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "An error occurred while restoring data",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Tools</h1>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-red-950 text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FolderSync className="w-6 h-6" />
            <span>Backup and Restore</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Manage your data backups and restorations
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {lastBackupDate && (
            <div className="bg-muted/50 p-3 rounded-md flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last backup</p>
                <p className="text-xs text-muted-foreground">{lastBackupDate}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select Backup File
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  accept=".json.gz"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? selectedFile.name : "Select Backup File"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleBackup}
                disabled={status === "backing-up"}
                className="w-full"
              >
                {status === "backing-up" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  "Create Backup"
                )}
              </Button>

              <div className="space-y-2">
                <Button
                  onClick={handleRestoreUsers}
                  disabled={!selectedFile || status === "restoring-users"}
                  variant="outline"
                  className="w-full"
                >
                  {status === "restoring-users" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Restoring Users...
                    </>
                  ) : (
                    "Restore Users"
                  )}
                </Button>

                <Button
                  onClick={handleRestoreAll}
                  disabled={!selectedFile || status === "restoring-all"}
                  variant="destructive"
                  className="w-full"
                >
                  {status === "restoring-all" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Restoring All Data...
                    </>
                  ) : (
                    "Restore All Data"
                  )}
                </Button>
              </div>
            </div>

            {status === "success" && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  {selectedFile ? "Restore completed successfully" : "Backup created successfully"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRestorePage
