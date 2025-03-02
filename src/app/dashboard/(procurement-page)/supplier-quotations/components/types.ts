interface QuotationItem {
  itemNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface SupplierQuotation {
  id: string;
  prno: string;
  supplierName: string;
  date: string;
  items?: QuotationItem[];
}

export interface BidItem {
  itemNo: number
  qty: number
  unit: string
  description: string
  bids: {
    [key: string]: {
      unitCost: number
      total: number
    }
  }
}
