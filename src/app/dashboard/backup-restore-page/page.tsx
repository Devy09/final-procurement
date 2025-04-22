"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  FolderSync,
  UploadCloud,
  DownloadCloud,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Shield,
  FileJson,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const BackupRestorePage = () => {
  const [status, setStatus] = useState<"idle" | "backing-up" | "restoring" | "success" | "error">("idle")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)

  const handleBackup = async () => {
    try {
      setStatus("backing-up")

      const response = await fetch("/api/admin-api/backup-restore-api/backup")

      if (!response.ok) {
        throw new Error("Failed to backup data")
      }

      const data = await response.json()

      // Create a Blob from the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      // Set filename with current date
      const date = new Date().toISOString().split("T")[0]
      setLastBackupDate(new Date().toLocaleString())
      link.href = url
      link.download = `backup-${date}.json`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setStatus("success")
      toast({
        title: "Backup Successful",
        description: "Your data has been successfully backed up.",
      })

      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      console.error("Backup error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "There was an error creating your backup. Please try again.",
      })

      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Backup file must be less than 10MB",
      })
      return
    }

    // Validate file type
    if (file.type !== "application/json") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a JSON backup file",
      })
      return
    }

    try {
      setStatus("restoring")

      const fileContent = await file.text()
      let backupData

      try {
        backupData = JSON.parse(fileContent)
      } catch (e) {
        throw new Error("Invalid JSON file format")
      }

      const response = await fetch("/api/admin-api/backup-restore-api/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backupData),
      })

      // Read the response body once and store it
      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        if (responseData?.error) {
          throw new Error(responseData.error)
        }
        throw new Error("Failed to restore data")
      }

      setStatus("success")
      toast({
        title: "Restore Successful",
        description: "Your data has been successfully restored.",
      })

      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      console.error("Restore error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Restore Failed",
        description:
          error instanceof Error ? error.message : "There was an error restoring your data. Please try again.",
      })

      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

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
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">Create Backup</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">JSON</span>
              </div>

              <Button
                className="w-full relative bg-blue-500 hover:bg-blue-600 text-primary-foreground"
                onClick={handleBackup}
                disabled={status === "backing-up" || status === "restoring"}
              >
                {status === "backing-up" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Backing up...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Back Up
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">Creates a downloadable JSON backup of your database</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-sm">Restore from Backup</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <FileJson className="w-3 h-3" />
                  <span>Max 10MB</span>
                </div>
              </div>

              <input type="file" ref={fileInputRef} accept=".json" onChange={handleRestore} className="hidden" />

              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-primary-foreground"
                onClick={() => fileInputRef.current?.click()}
                disabled={status === "backing-up" || status === "restoring"}
              >
                {status === "restoring" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-5 h-5 mr-2" />
                    Restore
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <Shield className="w-4 h-4" />
                <p>Restoring will overwrite existing data. Make sure you have a backup first.</p>
              </div>
            </div>
          </div>
        </CardContent>

        {status !== "idle" && (
          <CardFooter className="pt-0">
            <Alert variant={status === "error" ? "destructive" : "default"} className="w-full">
              <AlertTitle className="flex items-center gap-2">
                {status === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : status === "error" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {status === "backing-up"
                  ? "Creating Backup..."
                  : status === "restoring"
                    ? "Restoring Data..."
                    : status === "success"
                      ? "Operation Successful"
                      : status === "error"
                        ? "Error"
                        : ""}
              </AlertTitle>
              <AlertDescription>
                {status === "backing-up"
                  ? "Please wait while we prepare your backup file..."
                  : status === "restoring"
                    ? "Please wait while we restore your data..."
                    : status === "success"
                      ? "Your operation has been completed successfully."
                      : status === "error"
                        ? "An error occurred. Please try again."
                        : ""}
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default BackupRestorePage
