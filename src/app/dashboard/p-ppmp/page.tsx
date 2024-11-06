// src/app/dashboard/p-ppmp/page.tsx

'use client';

import React, { useState } from 'react';
import UploadPPMP from './components/UploadPPMP';
import AddItemDialog from './components/AddItemDialog';
import ItemTable from './components/ItemTable';

interface Item {
  id: number;
  description: string;
  unitCost: number;
  category: string;
}

const PPPMPPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert('Upload functionality not implemented yet.');
  };

  const handleAddItem = (description: string, unitCost: number, category: string) => {
    const newItem: Item = { id: items.length + 1, description, unitCost, category };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: number, updatedItem: Item) => {
    setItems(items.map((item) => (item.id === id ? updatedItem : item)));
  };

  return (
    <div className="h-screen p-8 flex flex-col gap-8">
      <UploadPPMP onUpload={handleUpload} onOpenDialog={() => setIsOpen(true)} />
      <ItemTable items={items} onDelete={handleDeleteItem} onUpdate={handleUpdateItem} />
      <AddItemDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default PPPMPPage;