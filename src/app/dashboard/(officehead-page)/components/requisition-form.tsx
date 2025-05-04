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

interface PrItemForm {
  description: string;
  unitCost: number;
  quantity: number;
  unit: string;
  stockNo: string;
}

interface PrItem extends PrItemForm {
  id: number;
  availableQuantity: number;
}

interface PPMPDropdownItem {
  id: string;
  ppmp_item: string;
  unit_cost: number;
  quantity: number;
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

  const handleSubmit = async (formData: any) => {
    try {
      const optimisticRequest = {
        id: crypto.randomUUID(),
        prno: formData.prno,
        department: formData.department,
        section: formData.section,
        date_submitted: new Date().toLocaleDateString(),
        pr_status: "pending"
      };
      
      onSuccess?.(optimisticRequest);

      const response = await fetch("/api/officehead-api/officehead-requisition/requisition", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create purchase request");
      }
      const result = await response.json();
      
      // Refresh the page after successful submission
      window.location.reload();
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-950 text-white hover:bg-red-900"><ClipboardPlus /> Purchase Request</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='bg-red-950 text-white p-6 rounded-lg'>
          <DialogTitle className='text-2xl'>Purchase Request Form</DialogTitle>
        </DialogHeader>
        <PurchaseRequestForm />
      </DialogContent>
    </Dialog>
  );
}

function PurchaseRequestForm() {
  const [prItems, setPrItems] = useState<PrItem[]>([]);
  const [newPrItem, setNewPrItem] = useState<PrItemForm>({
    description: '',
    unitCost: 0,
    quantity: 0,
    unit: '',
    stockNo: ''
  });
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [files, setFiles] = useState<AttachmentFiles>({
    certification: null,
    letter: null,
    proposal: null
  });
  const [purpose, setPurpose] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [dropdownItems, setDropdownItems] = useState<PPMPDropdownItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  useEffect(() => {
    const fetchDropdownItems = async () => {
      setIsLoadingItems(true);
      try {
        const response = await fetch('/api/officehead-api/officehead-ppmp/officehead-ppmp-dropdown');
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch dropdown items');
        }
        const data = await response.json();
        setDropdownItems(data);
      } catch (error) {
        console.error('Error fetching dropdown items:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load items for selection",
          variant: "destructive",
        });
        setDropdownItems([]); // Reset to empty array on error
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchDropdownItems();
  }, [toast]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If it's the quantity input, validate against available quantity and minimum value
    if (name === 'quantity' && value) {
      const numValue = Number(value);
      
      // Prevent 0 or negative values
      if (numValue <= 0) {
        toast({
          title: "Validation Error",
          description: "Quantity must be greater than 0",
          variant: "destructive",
        });
        return;
      }
      
      // Check against available quantity
      if (numValue > availableQuantity) {
        toast({
          title: "Validation Error",
          description: `Quantity cannot exceed available quantity (${availableQuantity})`,
          variant: "destructive",
        });
        return;
      }
    }

    setNewPrItem(prev => ({
      ...prev,
      [name]: name === 'unitCost' || name === 'quantity' ? Number(value) : value
    }));
  }, [availableQuantity, toast]);

  const handleSelectChange = useCallback((name: keyof Omit<PrItemForm, 'id'>, value: string) => {
    setNewPrItem(prev => {
      const updates: Partial<typeof prev> = { [name]: value };
      
      if (name === 'description') {
        const selectedItem = dropdownItems.find(item => item.ppmp_item === value);
        if (selectedItem) {
          updates.unitCost = selectedItem.unit_cost;
          setAvailableQuantity(selectedItem.quantity); // Store available quantity in separate state
          updates.quantity = 1; // Default input quantity to 1
        }
      }
      
      return { ...prev, ...updates };
    });
  }, [dropdownItems]);

  const addItem = useCallback(() => {
    const { description, unitCost, quantity, unit, stockNo } = newPrItem;
    
    if (quantity > availableQuantity) {
      toast({
        title: "Validation Error",
        description: `Quantity cannot exceed available quantity (${availableQuantity})`,
        variant: "destructive",
      });
      return;
    }

    if (!description || unitCost <= 0 || quantity <= 0 || !unit) {
      toast({
        title: "Validation Error",
        description: "Description, unit cost, quantity, and unit are required.",
        variant: "destructive",
      });
      return;
    }

    // Create a new item with all required fields
    const newItem: PrItem = {
      id: Date.now(),
      description,
      unitCost,
      quantity,
      unit,
      stockNo: stockNo || '', // Allow empty stockNo
      availableQuantity: 0 // We don't need this for display items
    };

    setPrItems(prev => [...prev, newItem]);
    setNewPrItem({
      description: '',
      unitCost: 0,
      quantity: 0,
      unit: '',
      stockNo: ''
    });
    setIsDialogOpen(false);
  }, [newPrItem, availableQuantity, toast]);

  const calculateTotal = useCallback(() => {
    return prItems.reduce((total, item) => total + (item.unitCost * item.quantity), 0);
  }, [prItems]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!purpose.trim() || prItems.length === 0 || !files.letter) {
      toast({
        title: "Submission Error",
        description: "Please provide all required fields and the approved letter",
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
    if (files.certification) {
      formData.append('certification', files.certification);
    }
    formData.append('letter', files.letter);
    if (files.proposal) {
      formData.append('proposal', files.proposal);
    }
  
    try {
      const response = await fetch("/api/officehead-api/officehead-requisition/requisition", {
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
        setPrItems([]);
        setPurpose('');
        setFiles({ certification: null, letter: null, proposal: null });
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
  }, [prItems, purpose, files, toast, calculateTotal]);

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
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader className='bg-red-950 text-white p-6 rounded-lg'>
              <DialogTitle className='text-2xl'>Select Item</DialogTitle>
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
                  <SelectItem value="none" disabled>
                    No items found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Available Quantity: {availableQuantity > 0 ? availableQuantity : 'N/A'}</label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  name="quantity"
                  placeholder="Quantity"
                  type="number"
                  value={newPrItem.quantity || ''}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  required
                />
              </div>
              <div className="flex-1">
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
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
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
                    <SelectItem value="Gallon">Gallon</SelectItem>
                    <SelectItem value="Ampule">Ampule</SelectItem>
                    <SelectItem value="Vial">Vial</SelectItem>
                    <SelectItem value="Cup">Cup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input
                  name="stockNo"
                  placeholder="Stock No."
                  value={newPrItem.stockNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
              
              <Button onClick={addItem} className="bg-red-950 text-white hover:bg-red-900"><PackagePlus /> Add Item</Button>
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
              Total Amount:
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
              Certification (optional)
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, 'certification')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Approved Letter (required)
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
              Proposal (optional)
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, 'proposal')}
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
