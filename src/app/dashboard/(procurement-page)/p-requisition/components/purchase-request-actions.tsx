import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ExternalLink, MoreHorizontal, Loader2 } from "lucide-react"

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PurchaseRequestItem {
  id: string
  itemNo: number
  quantity: number
  unit: string
  description: string
  stockNo: string | null
  unitCost: number
  totalCost: number
}

interface PurchaseRequestDetails {
  id: string
  prno: string
  department: string
  section: string
  date: string
  purpose: string
  status: string
  overallTotal: number
  items: PurchaseRequestItem[]
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
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

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/purchase-requests/${requisition.id}`)
          
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
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
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="font-medium text-gray-500">PR No</dt>
                          <dd>{prDetails.prno}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Date</dt>
                          <dd>{format(new Date(prDetails.date), 'PPP')}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Department</dt>
                          <dd>{prDetails.department}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Section</dt>
                          <dd>{prDetails.section}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Status and Purpose</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <dt className="font-medium text-gray-500">Status</dt>
                          <dd>
                            <Badge className={getStatusColor(prDetails.status)}>
                              {prDetails.status}
                            </Badge>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Purpose</dt>
                          <dd>{prDetails.purpose}</dd>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Items</CardTitle>
                    <CardDescription>List of items in this purchase request</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                            <TableCell className="text-right">₱{item.unitCost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">₱{item.totalCost.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={6} className="text-right font-medium">Overall Total:</TableCell>
                          <TableCell className="text-right font-medium">₱{prDetails.overallTotal.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="font-medium text-gray-500">Created By</dt>
                        <dd>{prDetails.createdBy.name}</dd>
                        <dd className="text-sm text-muted-foreground">{prDetails.createdBy.email}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">Created At</dt>
                        <dd>{format(new Date(prDetails.createdAt), 'PPP')}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}