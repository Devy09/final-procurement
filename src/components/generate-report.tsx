'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function GenerateReportDialog() {
  const handleDownloadReport = () => {
    alert("Report generation in progress..."); // Replace with actual report download logic
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <p>Select the period and click "Download" to generate a procurement report.</p>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleDownloadReport}>Download Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
