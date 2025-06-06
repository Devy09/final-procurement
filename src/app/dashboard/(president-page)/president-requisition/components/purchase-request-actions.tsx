'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ExternalLink, MoreHorizontal, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  certificationFile: string;
  letterFile: string;
  proposalFile: string;
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
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast();

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

      toast({
        title: "Success",
        description: "Purchase request approved successfully",
        variant: "default",
      });
      
      // Refresh the page after successful approval
      window.location.reload()
      
      setShowApprovalDialog(false)
    } catch (error) {
      console.error('Error approving purchase request:', error)
      toast({
        title: "Error",
        description: "Failed to approve purchase request",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsApproving(true)
    try {
      const response = await fetch(`/api/approval/president-approval/requisition-reject/${requisition.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      if (!response.ok) {
        throw new Error('Failed to reject purchase request')
      }

      toast({
        title: "Success",
        description: "Purchase request rejected successfully",
        variant: "default",
      });
      
      // Refresh the page after successful rejection
      window.location.reload()
      
      setShowRejectionDialog(false)
    } catch (error) {
      console.error('Error rejecting purchase request:', error)
      toast({
        title: "Error",
        description: "Failed to reject purchase request",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false)
    }
  }

  const renderAttachments = () => {
    if (!prDetails) return null;

    const attachments = [
      { label: 'Certification', file: prDetails.certificationFile },
      { label: 'Letter', file: prDetails.letterFile },
      { label: 'Proposal', file: prDetails.proposalFile },
    ];

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Attachments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attachments.map((attachment, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <dt className="font-medium text-gray-500 mb-2">
                {attachment.label}
              </dt>
              <dd className="text-lg">
                {attachment.file ? (
                <a
                  href={attachment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-950 text-white px-2 py-1 rounded-md"
                >
                  View File
                </a>                              
                ) : (
                  <span className="text-gray-400">No file uploaded</span>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Toaster />
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
            onClick={() => setShowApprovalDialog(true)}
            disabled={prDetails?.approvedByPresident === true}
            className="text-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Request
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowRejectionDialog(true)}
            disabled={prDetails?.approvedByPresident === true}
            className="text-red-700"
          >
            <span className="mr-2">❌</span>
            Reject Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Purchase Request</DialogTitle>
            <div className="mt-2 text-sm text-gray-500">
              Please provide a reason for rejecting this purchase request.
            </div>
          </DialogHeader>
          <div className="py-4">
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={!rejectionReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Purchase Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Legal Basis</h4>
              <p className="text-sm text-gray-600">
                This digital approval is in accordance with Republic Act No. 9184 (Government Procurement Reform Act) and its Implementing Rules and Regulations (IRR), which recognizes electronic procurement systems as valid means of conducting procurement processes.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isApproving || prDetails?.approvedByPresident === true}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
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
                    <div className="bg-red-950 text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">General Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">Department</span>
                            <span className="text-lg">{prDetails.department}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">Section</span>
                            <span className="text-lg">{prDetails.section}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">PR No</span>
                            <span className="text-lg">{prDetails.prno}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">Date</span>
                            <span className="text-lg">{format(new Date(prDetails.date), 'PPP')}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">SAI No</span>
                            <span className="text-lg">{prDetails.saino}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-500">ALOBS No</span>
                            <span className="text-lg">{prDetails.alobsno}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
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
                          {prDetails.items.map((item) => (
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
                          ))}
                          <TableRow>
                            <TableCell colSpan={6} className="text-right font-medium text-green-500">Total:</TableCell>
                            <TableCell className="text-right font-medium text-green-500">
                              ₱{parseFloat(prDetails.overallTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                      <dl className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-medium text-gray-500">Purpose</dt>
                          <dd className="text-lg">{prDetails.purpose}</dd>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-medium text-gray-500">Certified by</dt>
                          <dd className="text-lg">{prDetails.createdBy.name}</dd>
                        </div>
                      </dl>
                    </div>
                    {renderAttachments()}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
} 