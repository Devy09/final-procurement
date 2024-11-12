// requisition-form.tsx

'use client'

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPlus, PackagePlus, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface PrItem {
  id: number;
  description: string;
  unitCost: number;
  quantity: number;
  unit: string;
  stockNo: string;
}

export default function PurchaseRequestFormWrapper() {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button><ClipboardPlus /> Purchase Request</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='m-4'>
          <DialogTitle className='text-2xl'>Purchase Request Form</DialogTitle>
        </DialogHeader>
        <PurchaseRequestForm />
      </DialogContent>
    </Dialog>
  );
}

function PurchaseRequestForm() {
  const [prItems, setPrItems] = useState<PrItem[]>([]);
  const [newPrItem, setNewPrItem] = useState<Omit<PrItem, 'id'>>({
    description: '',
    unitCost: 0,
    quantity: 0,
    unit: '',
    stockNo: ''
  });
  const [purpose, setPurpose] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrItem(prev => ({
      ...prev,
      [name]: name === 'unitCost' || name === 'quantity' ? Number(value) : value
    }));
  }, []);

  const handleSelectChange = useCallback((name: keyof Omit<PrItem, 'id'>, value: string) => {
    setNewPrItem(prev => ({ ...prev, [name]: value }));
  }, []);

  const addItem = useCallback(() => {
    const { description, unitCost, quantity, unit } = newPrItem;
    if (!description || unitCost <= 0 || quantity <= 0 || !unit) {
      toast({
        title: "Validation Error",
        description: "All fields are required and must be valid.",
        variant: "destructive",
      });
      return;
    }

    setPrItems(prev => [...prev, { ...newPrItem, id: Date.now() }]);
    setNewPrItem({ description: '', unitCost: 0, quantity: 0, unit: '', stockNo: '' });
    setIsDialogOpen(false);
  }, [newPrItem, toast]);

  const calculateTotal = useCallback(() => {
    return prItems.reduce((total, item) => total + (item.unitCost * item.quantity), 0);
  }, [prItems]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!purpose.trim() || prItems.length === 0) {
      toast({
        title: "Submission Error",
        description: "Please provide a purpose and at least one item.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  
    const payload = {
      purpose,
      items: prItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        stockNo: item.stockNo,
        unitCost: item.unitCost
      }))
    };
  
    try {
      const response = await fetch("/api/purchase-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to submit purchase request.",
          variant: "destructive",
        });
      } else {
        setPrItems([]);
        setPurpose('');
        toast({
          title: "Success",
          description: "Purchase request submitted successfully!",
          variant: "default",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Error submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prItems, purpose, toast]);

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><PackagePlus /> Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-2xl mb-4'>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Select onValueChange={(value) => handleSelectChange('description', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Item Description" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arch File Folder">Arch File Folder</SelectItem>
                  <SelectItem value="Bond Paper">Bond Paper</SelectItem>
                  <SelectItem value="Binder Clip">Binder Clip</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="unitCost"
                placeholder="Unit Cost"
                type="number"
                value={newPrItem.unitCost || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
              <Input
                name="quantity"
                placeholder="Quantity"
                type="number"
                value={newPrItem.quantity || ''}
                onChange={handleInputChange}
                min="0"
                step="1"
                required
              />
              <Select onValueChange={(value) => handleSelectChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pieces">Pieces</SelectItem>
                  <SelectItem value="Ream">Ream</SelectItem>
                  <SelectItem value="Box">Box</SelectItem>
                  <SelectItem value="Pack">Pack</SelectItem>
                  <SelectItem value="Set">Set</SelectItem>
                  <SelectItem value="Bottle">Bottle</SelectItem>
                  <SelectItem value="Roll">Roll</SelectItem>
                </SelectContent>
              </Select>

              <Input
                name="stockNo"
                placeholder="Stock No."
                value={newPrItem.stockNo}
                onChange={handleInputChange}
              />
              
              <Button onClick={addItem}><PackagePlus /> Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item #</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Item Description</TableHead>
            <TableHead>Stock No.</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prItems.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.stockNo}</TableCell>
              <TableCell>₱{item.unitCost.toFixed(2)}</TableCell>
              <TableCell>₱{(item.unitCost * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right font-bold">Total</TableCell>
            <TableCell className="font-bold">₱{calculateTotal().toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-end">
        <Textarea
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full"
          required
        />
        <Button type="submit" className='flex items-center' disabled={isLoading}>
          {isLoading ? 'Submitting...' : <><FileDown /> Submit</>}
        </Button>
      </form>
    </div>
  );
}
