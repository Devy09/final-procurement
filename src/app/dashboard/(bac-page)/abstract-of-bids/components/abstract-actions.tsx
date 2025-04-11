"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Printer } from "lucide-react"
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
  const { toast } = useToast()

  const handlePrint = () => {
    setPrintDialogOpen(true)
  }

  return (
    <>
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
          <DropdownMenuItem onClick={handlePrint} className="cursor-pointer text-blue-600">
            <Printer className="mr-2 h-4 w-4" />
            Print Abstract
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] dialog-content">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
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
                    date: abstract.date,  // This is the abstract creation date
                    requestDate: abstract.requestDate,  // This is the request date
                    items: abstract.items?.map(item => ({
                      itemNo: item.itemNo,
                      description: item.description,
                      quantity: item.qty,
                      unit: item.unit,
                      bids: item.bids
                    })) || [],
                    overallTotal: abstract.overallTotal,
                    winningBidder: abstract.winningBidder
                  }}
                />
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-4 print:hidden">
            <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.print()} className="bg-red-950 text-white hover:bg-red-900">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}