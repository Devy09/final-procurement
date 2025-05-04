// requisition-form.tsx

'use client'

import { useState, useCallback, useEffect } from 'react';
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

interface PPMPDropdownItem {
  id: string;
  ppmp_item: string;
  unit_cost: number;
}

interface AttachmentFiles {
  certification: File | null;
  letter: File | null;
  proposal: File | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('PHP', '₱');
};

const getProcurementMode = (total: number) => {
  if (total >= 1000000) return "Competitive Bidding";
  if (total > 50000) return "Small Value";
  return "Shopping";
};

interface PurchaseRequestFormWrapperProps {
  onSuccess?: (newRequest: any) => void;
}

export default function PurchaseRequestFormWrapper({ onSuccess }: PurchaseRequestFormWrapperProps) {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const handleSuccess = (newRequest: any) => {
    onSuccess?.(newRequest);
    setIsMainDialogOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="customMaroon"><ClipboardPlus /> Purchase Request</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='bg-red-950 text-white p-4 rounded-md w-full'>
          <DialogTitle className='text-2xl font-bold'>Purchase Request Form</DialogTitle>
        </DialogHeader>
        <PurchaseRequestForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

function PurchaseRequestForm({ onSuccess }: PurchaseRequestFormWrapperProps) {
  
  const { toast } = useToast();
  const [prItems, setPrItems] = useState<PrItem[]>([]);
  const [newPrItem, setNewPrItem] = useState<Omit<PrItem, 'id'>>({
    description: '',
    unitCost: 0,
    quantity: 0,
    unit: '',
    stockNo: ''
  });
  const [files, setFiles] = useState<AttachmentFiles>({
      certification: null,
      letter: null,
      proposal: null
    });
  const [purpose, setPurpose] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<PPMPDropdownItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  useEffect(() => {
    const fetchDropdownItems = async () => {
      setIsLoadingItems(true);
      try {
        const response = await fetch('/api/ppmp-dropdown');
        if (!response.ok) throw new Error('Failed to fetch dropdown items');
        const data = await response.json();
        setDropdownItems(data);
      } catch (error) {
        console.error('Error fetching dropdown items:', error);
        toast({
          title: "Error",
          description: "Failed to load items for selection",
          variant: "destructive",
        });
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchDropdownItems();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrItem(prev => ({
      ...prev,
      [name]: name === 'unitCost' || name === 'quantity' ? Number(value) : value
    }));
  }, []);

  const handleSelectChange = useCallback((name: keyof Omit<PrItem, 'id'>, value: string) => {
    setNewPrItem(prev => {
      const updates: Partial<typeof prev> = { [name]: value };
      
      if (name === 'description') {
        const selectedItem = dropdownItems.find(item => item.ppmp_item === value);
        if (selectedItem) {
          updates.unitCost = selectedItem.unit_cost;
        }
      }
      
      return { ...prev, ...updates };
    });
  }, [dropdownItems]);

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
  
    if (!purpose.trim() || prItems.length === 0 || 
    !files.certification || !files.letter || !files.proposal) {
      toast({
        title: "Submission Error",
        description: "Please provide all required fields and attachments",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  
    const total = calculateTotal();
    const formData = new FormData();

    // Append form data
    formData.append('purpose', purpose);
    formData.append('items', JSON.stringify(prItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      stockNo: item.stockNo,
      unitCost: item.unitCost
    }))));
    formData.append('procurementMode', getProcurementMode(total));
    formData.append('totalAmount', total.toString());
    
    // Append files
    formData.append('certification', files.certification);
    formData.append('letter', files.letter);
    formData.append('proposal', files.proposal);
  
    try {
      const response = await fetch("/api/purchase-request", {
        method: "POST",
        body: formData,
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
        const result = await response.json();
        onSuccess?.(result);
        setPrItems([]);
        setPurpose('');
        setFiles({ certification: null, letter: null, proposal: null });
        toast({
          title: "Success",
          description: "Purchase request submitted successfully!",
          variant: "default",
        });
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
  }, [prItems, purpose, files, toast, calculateTotal, onSuccess]);

  const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>, key: keyof AttachmentFiles) => {
        const file = e.target.files?.[0] || null;
        setFiles(prev => ({ ...prev, [key]: file }));
      },
      []
    );

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="customMaroon"><PackagePlus /> Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="bg-red-950 text-white p-4 rounded-lg">
              <DialogTitle className='text-2xl'>
                PPMP Items
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Select onValueChange={(value) => handleSelectChange('description', value)}>
                <SelectTrigger disabled={isLoadingItems}>
                  <SelectValue placeholder={isLoadingItems ? "Loading items..." : "Item Description"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingItems ? (
                    <SelectItem value="loading" disabled>
                      Loading items...
                    </SelectItem>
                  ) : dropdownItems.length > 0 ? (
                    dropdownItems.map((item) => (
                      <SelectItem key={item.id} value={item.ppmp_item}>
                        {item.ppmp_item}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-items" disabled>
                      No items available
                    </SelectItem>
                  )}
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
                readOnly
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
                  <SelectItem value="Pcs">Pcs</SelectItem>
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
              
              <Button onClick={addItem} className="bg-red-950 text-white"><PackagePlus /> Add Item</Button>
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
              <TableCell>{formatCurrency(item.unitCost)}</TableCell>
              <TableCell>{formatCurrency(item.unitCost * item.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right font-bold">
              Total Amount: {formatCurrency(calculateTotal())}
            </TableCell>
            <TableCell className="font-bold">
              {formatCurrency(calculateTotal())}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="text-right font-bold">
              Procurement Mode:
            </TableCell>
            <TableCell className="font-bold">
              {getProcurementMode(calculateTotal())}
            </TableCell>
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
        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Certification (required)
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, 'certification')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Letter (required)
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, 'letter')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Proposal (required)
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, 'proposal')}
              required
            />
          </div>
        </div>
        <Button type="submit" className='flex items-center bg-customMaroon' disabled={isLoading}>
          {isLoading ? 'Submitting...' : <><FileDown /> Submit</>}
        </Button>
      </form>
    </div>
  );
}
