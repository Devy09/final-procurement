"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Printer, X, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AbstractPrint } from "./abstract-print"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Committee {
  id: string;
  committee_name: string;
  committee_title: string;
  committee_designation: string;
  createdAt: string;
  updatedAt: string;
}

interface AbstractActionsProps {
  abstract: {
    id: string;
    prno: string;
    requestDate: string;
    date: string;
    overallTotal: string;
    winningBidder: string | null;
    suppliers: string[];
    items?: {
      itemNo: number;
      description: string;
      qty: number;
      unit: string;
      bids: Record<string, { unitCost: number; total: number }>;
    }[];
  }
}

export function AbstractActions({ abstract }: AbstractActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [selectedCommittees, setSelectedCommittees] = useState<Committee[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await fetch('/api/committees')
        const data = await response.json() as Committee[]
        setCommittees(data)
      } catch (error) {
        console.error('Error fetching committees:', error)
      }
    }
    fetchCommittees()
  }, [])

  useEffect(() => {
    if (!printDialogOpen) {
      setSelectedCommittees([])
    }
  }, [printDialogOpen])

  const handleAddCommittee = (committee: Committee) => {
    if (!selectedCommittees.some(c => c.id === committee.id)) {
      setSelectedCommittees(prev => [...prev, committee])
    } else {
      toast({
        title: "Error",
        description: "Committee already selected",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPrintDialogOpen(true)} className="cursor-pointer text-blue-600">
              <Printer className="mr-2 h-4 w-4" />
              Print Abstract
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] dialog-content">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(95vh-8rem)]">
            <div className="print-container bg-white text-black">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <AbstractPrint
                  data={{
                    prNo: abstract.prno,
                    date: abstract.date,
                    requestDate: abstract.requestDate,
                    items: abstract.items?.map(item => ({
                      itemNo: item.itemNo,
                      description: item.description,
                      quantity: item.qty,
                      unit: item.unit,
                      bids: item.bids
                    })) || [],
                    overallTotal: abstract.overallTotal,
                    winningBidder: abstract.winningBidder,
                    committees: selectedCommittees.map(committee => ({
                      name: committee.committee_name,
                      title: committee.committee_title,
                      designation: committee.committee_designation
                    }))
                  }}
                />
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-between gap-2 print:hidden">
            <div className="flex flex-col gap-2 w-full top-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span>Select a committee</span>
                  <Select value={undefined} onValueChange={(value) => {
                    const selectedCommittee = committees.find(c => c.id === value)
                    if (selectedCommittee) {
                      handleAddCommittee(selectedCommittee)
                    }
                  }}>
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Select committee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {committees.map((committee) => (
                        <SelectItem key={committee.id} value={committee.id}>
                          {committee.committee_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCommittees([])
                  setPrintDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-red-950 text-white hover:bg-red-900"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}