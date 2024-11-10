// requisition-form.tsx

'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardPlus, PackagePlus, FileDown, FileText } from "lucide-react"

interface PrItem {
  id: number
  description: string
  unitCost: number
  quantity: number
  unit: string
  stockNo: string
}

export default function PurchaseRequestFormWrapper() {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)

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
  )
}

function PurchaseRequestForm() {
  const [prItems, setPrItems] = useState<PrItem[]>([])
  const [newPrItem, setNewPrItem] = useState<Omit<PrItem, 'id'>>({
    description: '',
    unitCost: 0,
    quantity: 0,
    unit: '',
    stockNo: ''
  })
  const [purpose, setPurpose] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPrItem(prev => ({
      ...prev,
      [name]: name === 'unitCost' || name === 'quantity' ? Number(value) : value
    }))
    setErrorMessage('')
  }, [])

  const handleSelectChange = useCallback((name: keyof Omit<PrItem, 'id'>, value: string) => {
    setNewPrItem(prev => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }, [])

  const addItem = useCallback(() => {
    const { description, unitCost, quantity, unit } = newPrItem
    if (!description || unitCost <= 0 || quantity <= 0 || !unit) {
      setErrorMessage("All fields are required and must be valid.")
      setSuccessMessage('')
      return
    }

    setPrItems(prev => [...prev, { ...newPrItem, id: Date.now() }])
    setNewPrItem({ description: '', unitCost: 0, quantity: 0, unit: '', stockNo: '' })
    setIsDialogOpen(false)
    setErrorMessage('')
    setSuccessMessage('Item added successfully!')
    
    setTimeout(() => setSuccessMessage(''), 3000)
  }, [newPrItem])

  const calculateTotal = useCallback(() => {
    return prItems.reduce((total, item) => total + (item.unitCost * item.quantity), 0)
  }, [prItems])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', { items: prItems, purpose })
  }, [prItems, purpose])

  return (
    <div className="space-y-6">
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
              />
              <Input
                name="quantity"
                placeholder="Quantity"
                type="number"
                value={newPrItem.quantity || ''}
                onChange={handleInputChange}
                min="0"
                step="1"
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
              {errorMessage && <p className="text-red-600" aria-live="assertive">{errorMessage}</p>}
              {successMessage && <p className="text-green-600" aria-live="polite">{successMessage}</p>}
              
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
        />
        <Button type="submit" className='flex items-center'><FileDown /> Submit</Button>
      </form>
    </div>
  )
}
