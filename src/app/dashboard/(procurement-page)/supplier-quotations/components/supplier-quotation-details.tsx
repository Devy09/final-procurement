"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, FileText, User, Calendar, Banknote } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SupplierQuotationItem {
  id: string;
  itemNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

interface SupplierQuotationDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotationId: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

export function SupplierQuotationDetails({
  open,
  onOpenChange,
  quotationId,
}: SupplierQuotationDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (open && quotationId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/supplier-quotation/${quotationId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch details');
          }
          const data = await response.json();
          setDetails(data);
        } catch (error) {
          console.error('Error fetching details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetails();
    }
  }, [open, quotationId]);

  const calculateOverallTotal = (items: SupplierQuotationItem[]) => {
    return items.reduce((total, item) => total + item.totalCost, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Supplier Quotation Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <ScrollArea className="h-[calc(90vh-8rem)]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">PR Number</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{details.prno}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Supplier Name</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{details.supplierName}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Date</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {format(new Date(details.date), "MMMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quotation Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Item #</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {details.items.map((item: SupplierQuotationItem) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemNumber}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.unit}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.totalCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row md:justify-end">
                <Card className="ml-auto w-full md:w-1/3">
                  <CardHeader className="flex flex-row items-center justify-between py-2">
                    <CardTitle className="text-xl font-bold">Overall Total</CardTitle>
                    <Banknote className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary text-right mt-4">
                      {formatCurrency(calculateOverallTotal(details.items))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Badge variant="destructive">Failed to load quotation details</Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

