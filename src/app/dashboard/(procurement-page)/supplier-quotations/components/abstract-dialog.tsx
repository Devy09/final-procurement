import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplierQuotation, BidItem } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileBadge } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AbstractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AbstractDialog({
  open,
  onOpenChange,
}: AbstractDialogProps) {
  const [quotations, setQuotations] = useState<SupplierQuotation[]>([]);
  const [selectedPR, setSelectedPR] = useState<string>("");
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [isCreatingPO, setIsCreatingPO] = useState(false);

  useEffect(() => {
    if (open) {
      const url = selectedPR && selectedPR !== "all"
        ? `/api/supplier-quotation?prno=${selectedPR}`
        : "/api/supplier-quotation";
        
      fetch(url)
        .then((response) => response.json())
        .then((data) => setQuotations(data))
        .catch((error) => console.error("Error fetching quotations:", error));
    }
  }, [open, selectedPR]);

  // Get unique PR numbers
  const uniquePRNumbers = Array.from(new Set(quotations.map(q => q.prno)));

  const handleCreateAbstract = async () => {
    if (!selectedPR || selectedPR === "all") {
      alert("Please select a PR number first");
      return;
    }
    console.log("Creating abstract for PR:", selectedPR);
  };

  const transformQuotationsToAbstractFormat = (): BidItem[] => {
    const itemsMap = new Map<string, BidItem>();
    
    quotations.forEach(quotation => {
      quotation.items?.forEach(item => {
        if (!itemsMap.has(item.itemNumber)) {
          itemsMap.set(item.itemNumber, {
            itemNo: parseInt(item.itemNumber),
            qty: item.quantity,
            unit: item.unit,
            description: item.description,
            bids: {}
          });
        }
        
        const bidItem = itemsMap.get(item.itemNumber)!;
        bidItem.bids[quotation.supplierName] = {
          unitCost: item.unitCost,
          total: item.totalCost
        };
      });
    });

    return Array.from(itemsMap.values());
  };

  const getBidders = (): string[] => {
    return Array.from(new Set(quotations.map(q => q.supplierName)));
  };

  const handleSetWinningBidder = async () => {
    if (!selectedWinner || !selectedPR) return;
    
    try {
      setIsCreatingPO(true);
      
      // Get the winning bidder's items
      const winningBids = transformQuotationsToAbstractFormat()
        .map(item => ({
          itemNumber: item.itemNo,
          description: item.description,
          quantity: item.qty,
          unit: item.unit,
          unitCost: item.bids[selectedWinner]?.unitCost || 0,
          totalCost: item.bids[selectedWinner]?.total || 0
        }))
        .filter(item => item.unitCost > 0); // Only include items with bids

      const purchaseOrder = {
        prno: selectedPR,
        supplierName: selectedWinner,
        items: winningBids,
        totalAmount: winningBids.reduce((sum, item) => sum + item.totalCost, 0),
        date: new Date().toISOString()
      };

      const response = await fetch('/api/purchase-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseOrder),
      });

      if (!response.ok) throw new Error('Failed to create Purchase Order');

      // Close dialog and show success message
      onOpenChange(false);
      // You might want to add a toast notification here
      
    } catch (error) {
      console.error('Error creating Purchase Order:', error);
      alert('Failed to create Purchase Order. Please try again.');
    } finally {
      setIsCreatingPO(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Opening of Quotations</DialogTitle>
          <DialogDescription>
            Compare supplier quotation details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-4">
            <Select value={selectedPR} onValueChange={setSelectedPR}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by PR Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All PR Numbers</SelectItem>
                {uniquePRNumbers.map((prno) => (
                  <SelectItem key={prno} value={prno}>
                    {prno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleCreateAbstract}
              disabled={!selectedPR || selectedPR === "all"}
            >
              <FileBadge className="mr-2" /> Create Abstract
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} rowSpan={2} className="border-r text-center p-2 text-sm">
                    Items
                  </TableHead>
                  <TableHead rowSpan={3} className="border-r text-center p-2 text-sm">
                    Description of Articles
                  </TableHead>
                  <TableHead colSpan={quotations.length * 2} className="border-r customFont text-center p-2 text-sm">
                    Name of Bidders
                  </TableHead>
                </TableRow>
                <TableRow>
                  {getBidders().map((bidder) => (
                    <TableHead key={bidder} colSpan={2} className="border-r text-center p-2 text-xs">
                      {bidder}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead className="border-r p-2 text-sm">Item #</TableHead>
                  <TableHead className="border-r p-2 text-sm">Qty</TableHead>
                  <TableHead className="border-r p-2 text-sm">Unit</TableHead>
                  {getBidders().map((bidder) => (
                    <React.Fragment key={bidder}>
                      <TableHead className="border-r text-right p-2 text-sm">Unit Cost</TableHead>
                      <TableHead className="border-r text-right p-2 text-sm">Total</TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transformQuotationsToAbstractFormat().map((item) => (
                  <TableRow key={item.itemNo}>
                    <TableCell className="border-r p-2 text-sm">{item.itemNo}</TableCell>
                    <TableCell className="border-r text-right p-2 text-sm">{item.qty}</TableCell>
                    <TableCell className="border-r p-2 text-sm">{item.unit}</TableCell>
                    <TableCell className="border-r p-2 text-sm">{item.description}</TableCell>
                    {getBidders().map((bidder) => (
                      <React.Fragment key={bidder}>
                        <TableCell className="border-r text-right p-2 text-sm">
                          {(!item.bids[bidder] || item.bids[bidder]?.unitCost === 0) ? '-' : 
                            item.bids[bidder]?.unitCost.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'PHP'
                            })}
                        </TableCell>
                        <TableCell className="border-r text-right p-2 text-sm">
                          {(!item.bids[bidder] || item.bids[bidder]?.total === 0) ? '-' : 
                            item.bids[bidder]?.total.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'PHP'
                            })}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell className="border-r p-2 text-sm text-center" colSpan={4}>
                    TOTAL
                  </TableCell>
                  {getBidders().map((bidder) => {
                    const total = transformQuotationsToAbstractFormat()
                      .reduce((sum, item) => sum + (item.bids[bidder]?.total || 0), 0);
                    return (
                      <React.Fragment key={bidder}>
                        <TableCell className="border-r text-right p-2 text-sm">-</TableCell>
                        <TableCell className="border-r text-right p-2 text-sm">
                          {total === 0 ? '-' : total.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'PHP'
                          })}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="winner" className="whitespace-nowrap font-semibold">
                Award Recommended to:
              </Label>
              <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {getBidders().map((bidder) => (
                    <SelectItem key={bidder} value={bidder}>
                      {bidder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              disabled={!selectedWinner} 
              onClick={handleSetWinningBidder}
              className="gap-2"
            >
              {isCreatingPO ? (
                <>
                  <span className="animate-spin">⏳</span> Creating PO...
                </>
              ) : (
                'Set as Winning Bidder'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 