'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (description: string, unitCost: number, category: string) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ isOpen, onClose, onAddItem }) => {
  const [description, setDescription] = useState('');
  const [unitCost, setUnitCost] = useState<number | ''>('');
  const [category, setCategory] = useState('');

  const handleAddItem = () => {
    if (description && unitCost && category) {
      onAddItem(description, Number(unitCost), category);
      setDescription('');
      setUnitCost('');
      setCategory('');
      onClose();
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Provide the item details below.</DialogDescription>
        </DialogHeader>

        <Label htmlFor="description">Item Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
        />

        <Label htmlFor="unit-cost">Unit Cost</Label>
        <Input
        id="unit-cost"
        type="number"
        value={unitCost === "" ? "" : unitCost} // Maintain empty string when needed
        onChange={(e) => setUnitCost(e.target.value === "" ? "" : Number(e.target.value))}
        className="mb-2"
        />

        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4"
        />

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="ml-2" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;