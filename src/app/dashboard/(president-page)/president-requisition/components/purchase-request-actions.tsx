'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ExternalLink, MoreHorizontal, Loader2, CheckCircle } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface PurchaseRequestItem {
  id: string
  itemNo: number
  quantity: number
  unit: string
  description: string
  stockNo: string | null
  unitCost: string
  totalCost: string
}

interface PurchaseRequestDetails {
  id: string
  prno: string
  department: string
  section: string
  date: string
  saino: string
  alobsno: string
  purpose: string
  status: string
  overallTotal: string
  items: PurchaseRequestItem[]
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  approvedByPresident: boolean
  approvedAtPresident?: string
  presidentName?: string
  presidentRole?: string
}

interface PurchaseRequestColumn {
  id: string
}

interface PurchaseRequestActionsProps {
  requisition: PurchaseRequestColumn
}

export function PurchaseRequestActions({ requisition }: PurchaseRequestActionsProps) {
  const [open, setOpen] = useState(false)
  const [prDetails, setPrDetails] = useState<PurchaseRequestDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/requisition-view/${requisition.id}`)
          
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`)
          }
          
          const data = await response.json()
          setPrDetails(data)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [open, requisition.id])

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const response = await fetch(`/api/approval/president-approval/requisition-approve/${requisition.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to approve purchase request')
      }

      toast.success('Purchase request approved successfully')
      // Refresh the data
      if (open) {
        const updatedResponse = await fetch(`/api/requisition-view/${requisition.id}`)
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setPrDetails(updatedData)
        }
      }
    } catch (error) {
      console.error('Error approving purchase request:', error)
      toast.error('Failed to approve purchase request')
    } finally {
      setIsApproving(false)
    }
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
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <ExternalLink className="mr-2 h-4 w-4" />View Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleApprove}
            disabled={isApproving || prDetails?.approvedByPresident === true}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              'Approve Request'
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {/* ... Rest of the dialog content remains the same as accountant's version ... */}
        </DialogContent>
      </Dialog>
    </>
  )
} 