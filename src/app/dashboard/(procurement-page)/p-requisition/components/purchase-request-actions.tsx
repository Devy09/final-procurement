'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ExternalLink, MoreHorizontal, Loader2, CheckCircle, MapPin, Printer } from 'lucide-react'
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
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import DocumentTracker from './document-tracker'
import PurchaseRequestPage from "@/components/requisition-print";

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
    createdAt: string
  }
  approvedByProcurementOfficer: boolean
  procurementOfficerName: string
  accountantName: string
  presidentName: string
  procurementOfficerRole: string
  accountantRole: string
  presidentRole: string
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
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)

  useEffect(() => {
    if (open || printOpen) {
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
  }, [open, printOpen, requisition.id])

  const handlePrint = () => {
    setPrintOpen(true);
  };

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const response = await fetch(`/api/approval/officer-approval/requisition-approve/${requisition.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to approve purchase request')
      }

      toast.success('Purchase request approved successfully')
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
            disabled={isApproving || prDetails?.approvedByProcurementOfficer === true}
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
          <DropdownMenuItem onClick={() => setTrackerOpen(true)}> 
            <MapPin className="mr-2 h-4 w-4" />Track Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}> 
            <Printer className="mr-2 h-4 w-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Purchase Request Details</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : prDetails ? (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">General Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">Department:</span>
                            <span>{prDetails.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">Section:</span>
                            <span>{prDetails.section}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">PR No:</span>
                            <span>{prDetails.prno}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">Date:</span>
                            <span>{format(new Date(prDetails.date), 'PPP')}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">SAI No:</span>
                            <span>{prDetails.saino}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-500">ALOBS No:</span>
                            <span>{prDetails.alobsno}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item No</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Stock No</TableHead>
                            <TableHead className="text-right">Unit Cost</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prDetails?.items?.length ? (
                            prDetails.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemNo}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.stockNo || '-'}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ₱{parseFloat(item.unitCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₱{parseFloat(item.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                              </TableRow>
                            ))
                            
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-gray-500">
                                No items found.
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell colSpan={6} className="text-right font-medium text-green-500">Total:</TableCell>
                            <TableCell className="text-right font-medium text-green-500">
                              ₱{parseFloat(prDetails.overallTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                      <dl className="space-y-4">
                        <div>
                          <dt className="font-medium text-gray-500">Purpose</dt>
                          <dd>{prDetails.purpose}</dd>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <dt className="font-medium text-gray-500">Submitted by</dt>
                            <dd>
                              {prDetails.createdBy.name}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={trackerOpen} onOpenChange={setTrackerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Tracker</DialogTitle>
          </DialogHeader>
          <DocumentTracker purchaseRequestId={requisition.id} />
        </DialogContent>
      </Dialog>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="max-w-[22cm] max-h-[95vh] dialog-content">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(95vh-8rem)]">
            <div className="print-container bg-white shadow-lg text-black">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : prDetails ? (
              <PurchaseRequestPage 
                data={{
                  prNo: prDetails.prno,
                  date: prDetails.date,
                  department: prDetails.department,
                  section: prDetails.section,
                  saino: prDetails.saino,
                  alobsno: prDetails.alobsno,
                  purpose: prDetails.purpose,
                  items: prDetails.items,
                  overallTotal: prDetails.overallTotal,
                  createdBy: prDetails.createdBy,
                  procurementOfficerName: prDetails.procurementOfficerName,
                  accountantName: prDetails.accountantName,
                  presidentName: prDetails.presidentName,
                  procurementOfficerRole: prDetails.procurementOfficerRole,
                  accountantRole: prDetails.accountantRole,
                  presidentRole: prDetails.presidentRole,
                }} 
              />
            ) : (
                <div className="text-center py-4">No data available</div>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-4 print:hidden">
            <Button variant="outline" onClick={() => setPrintOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}