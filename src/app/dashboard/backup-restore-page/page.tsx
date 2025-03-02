"use client"

import React, { useState, useRef } from "react"
import { FolderSync, Database, UploadCloud, DownloadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const BackupRestorePage = () => {
  const [status, setStatus] = useState<"idle" | "backing-up" | "restoring" | "success" | "error">("idle")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    } catch (error) {
      console.error("Backup error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "There was an error creating your backup. Please try again.",
      })
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
    } catch (error) {
      console.error("Restore error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "There was an error restoring your data. Please try again.",
      })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-80 ml-20">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-950 text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FolderSync className="w-6 h-6" />
            <span>Backup and Restore</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Manage your data backups and restorations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Button
            className="w-full relative bg-blue-500 text-primary-foreground"
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

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleRestore}
            className="hidden"
          />

          <Button
            className="w-full bg-green-500 text-primary-foreground"
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
        </CardContent>
        <CardFooter>
          {status !== "idle" && (
            <Alert 
              variant={status === "error" ? "destructive" : "default"} 
              className="w-full"
            >
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
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default BackupRestorePage

