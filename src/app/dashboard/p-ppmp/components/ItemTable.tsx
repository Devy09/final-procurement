'use client';

import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Item {
  id: number;
  description: string;
  unitCost: number;
  category: string;
}

interface ItemTableProps {
  items: Item[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedItem: Item) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onDelete, onUpdate }) => {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Item>>({});

  const handleEditClick = (item: Item) => {
    setEditingItemId(item.id);
    setEditedItem(item);
  };

  const handleSaveClick = () => {
    if (editingItemId && editedItem.description && editedItem.unitCost && editedItem.category) {
      onUpdate(editingItemId, editedItem as Item);
      setEditingItemId(null);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleCancelClick = () => {
    setEditingItemId(null);
    setEditedItem({});
  };

  const handleDeleteClick = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="table-fixed w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300 px-4 py-2 w-20">ID</TableHead>
            <TableHead className="border border-gray-300 px-4 py-2 w-1/2">Item Description</TableHead>
            <TableHead className="border border-gray-300 px-4 py-2 w-32">Unit Cost</TableHead>
            <TableHead className="border border-gray-300 px-4 py-2 w-32">Category</TableHead>
            <TableHead className="border border-gray-300 px-4 py-2 w-36">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) =>
              editingItemId === item.id ? (
                <TableRow key={item.id}>
                  <TableCell className="border border-gray-300 px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    <Input
                      value={editedItem.description || ''}
                      onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    <Input
                      type="number"
                      value={editedItem.unitCost || ''}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, unitCost: Number(e.target.value) })
                      }
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    <Input
                      value={editedItem.category || ''}
                      onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    <Button className="mr-2" onClick={handleSaveClick}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={item.id}>
                  <TableCell className="border border-gray-300 px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">{item.description}</TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">{item.unitCost}</TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">{item.category}</TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    <Button className="mr-2" onClick={() => handleEditClick(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="border border-gray-300 px-4 py-2 text-center">
                No items to display
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTable;
