"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ExternalLink,
  MoreHorizontal,
  Loader2,
  Printer,
  Check,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuotationForm from "@/components/quotation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuotationItem {
  id: string;
  itemNo: number;
  quantity: number;
  unit: string;
  description: string;
}

interface QuotationDetails {
  id: string;
  prno: string;
  department: string;
  section: string;
  date: string;
  items: QuotationItem[];
}

interface QuotationColumn {
  id: string;
}

interface QuotationActionsProps {
  requisition: QuotationColumn;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function QuotationActions({ requisition }: QuotationActionsProps) {
  const [open, setOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState<QuotationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [items, setItems] = useState<Array<QuotationItem & { unitCost?: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open || printDialogOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/quotation/${requisition.id}`);

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          setQuotationDetails(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load quotation details");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open, printDialogOpen, requisition.id]);

  const handlePrint = () => {
    setPrintDialogOpen(true);
  };
  
  useEffect(() => {
    if (quotationDetails) {
      setItems(quotationDetails.items.map(item => ({ ...item, unitCost: 0 })));
    }
  }, [quotationDetails]);

  const handleUnitCostChange = (id: string, value: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, unitCost: parseFloat(value) || 0 } : item
      )
    );
  };


  const resetForm = () => {
    setSupplierName("");
    setItems(quotationDetails?.items.map(item => ({ ...item, unitCost: 0 })) || []);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, quotationDetails]);

  const handleCreateSupplierQuotation = async () => {
    if (!supplierName.trim()) {
      toast.error("Please enter supplier name");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/supplier-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierName,
          prno: quotationDetails?.prno,
          items: items.map(item => ({
            itemNo: item.itemNo,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost || 0,
            totalCost: (item.unitCost || 0) * item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      toast.success("Supplier quotation created successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error creating supplier quotation:", error);
      toast.error("Failed to create supplier quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateOverallTotal = () => {
    return items.reduce((total, item) => {
      return total + ((item.unitCost || 0) * item.quantity);
    }, 0);
  };

  // Add this function to prevent wheel events on number inputs
  const preventWheelChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur(); // Remove focus from input
    e.stopPropagation(); // Stop event from bubbling up
  };

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
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Preview
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : quotationDetails ? (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="mb-4">
                      <Label htmlFor="supplierName">Name of Supplier</Label>
                      <Input
                        id="supplierName"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="max-w-md"
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item #</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.itemNo}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.unitCost || ''}
                                  onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                                  onWheel={preventWheelChange}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                {formatCurrency((item.unitCost || 0) * item.quantity)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-t-2 border-primary">
                            <TableCell colSpan={5} className="text-right font-bold">
                              Overall Total:
                            </TableCell>
                            <TableCell className="font-bold">
                              {formatCurrency(calculateOverallTotal())}
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
          
          <div className="flex justify-end">
            <Button 
              onClick={handleCreateSupplierQuotation}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Creating..." : "Create Supplier Quotation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
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
              ) : (
                <QuotationForm
                  data={{
                    prNo: quotationDetails?.prno,
                    date: quotationDetails?.date,
                    items: quotationDetails?.items,
                  }}
                />
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-4 print:hidden">
            <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
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
  );
}
