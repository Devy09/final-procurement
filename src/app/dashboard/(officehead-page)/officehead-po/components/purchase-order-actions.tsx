"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ExternalLink, MoreHorizontal, Loader2, Printer } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PurchaseOrderPage from "@/components/purchase-order-print"

interface PurchaseOrderItem {
  id: string
  itemNumber: string
  quantity: number
  unit: string
  description: string
  unitCost: number
  totalCost: number
}

interface PurchaseOrderDetails {
  id: string
  prno: string
  supplierName: string
  totalAmount: number
  date: string
  status: string
  items: PurchaseOrderItem[]
  approvedByAccountant: boolean
  accountantName: string
  presidentName: string
  accountantTitle: string
  presidentTitle: string
  accountantSignatureUrl: string
  presidentSignatureUrl: string
  accountantDesignation: string
  presidentDesignation: string
}

interface PurchaseOrderActionsProps {
  purchaseOrder: {
    id: string
    prno: string
    supplierName: string
    totalAmount: number
    date: string
    status: string
  }
}

export function PurchaseOrderActions({ purchaseOrder }: PurchaseOrderActionsProps) {
  const [open, setOpen] = useState(false)
  const [poDetails, setPoDetails] = useState<PurchaseOrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)

  useEffect(() => {
    if (open || printOpen) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/purchase-order/${purchaseOrder.id}`)
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`)
          }
          const data = await response.json()
          setPoDetails(data)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [open, printOpen, purchaseOrder.id])


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
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <ExternalLink className="mr-2 h-4 w-4" />View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader className="bg-red-950 text-white p-6 rounded-lg">
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : poDetails ? (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-red-950 text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">General Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-200">PR Number:</span>
                            <span>{poDetails.prno}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-200">Supplier:</span>
                            <span>{poDetails.supplierName}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-200">Date:</span>
                            <span>{format(new Date(poDetails.date), 'PPP')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-200">Status:</span>
                            <span className="capitalize">{poDetails.status}</span>
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
                            <TableHead className="text-right">Unit Cost</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {poDetails?.items?.length ? (
                            poDetails.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemNumber}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ₱{item.unitCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₱{item.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-gray-500">
                                No items found.
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell colSpan={5} className="text-right font-medium text-green-500">Total:</TableCell>
                            <TableCell className="text-right font-medium text-green-500">
                              ₱{poDetails.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
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