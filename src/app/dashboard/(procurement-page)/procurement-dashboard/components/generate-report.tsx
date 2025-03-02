import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface MonthlyPurchaseReportProps {
  reportData?: ReportData[]
  preparedBy?: string
}

interface ReportData {
  month: string
  totalSpend: number
  purchaseRequestCount: number
  officeQuotationsCount: number
  supplierQuotationsCount: number
}

export default function MonthlyPurchaseReport({
  reportData = [],
  preparedBy = "",
}: MonthlyPurchaseReportProps) {
  // Default months if no data is provided
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]

  // If no data is provided, create empty rows for each month
  const tableData =
    reportData.length > 0
      ? reportData
      : months.map((month) => ({
          month,
          totalSpend: 0,
          purchaseRequestCount: 0,
          officeQuotationsCount: 0,
          supplierQuotationsCount: 0,
        }))

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="p-0">
        <div className="text-2xl font-bold text-[#000080] mb-2">Procurement Monthly Report</div>
        <div className="text-center py-1 border-b border-black font-semibold">
          MONTHLY PROCUREMENT ACTIVITY REPORT
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-red-950 font-bold border border-black text-center text-white">MONTH</TableHead>
              <TableHead className="font-bold border border-black text-center">TOTAL SPEND</TableHead>
              <TableHead className="font-bold border border-black text-center">PURCHASE REQUESTS</TableHead>
              <TableHead className="font-bold border border-black text-center">OFFICE QUOTATIONS</TableHead>
              <TableHead className="font-bold border border-black text-center">SUPPLIER QUOTATIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="border border-black text-left font-bold">{row.month}</TableCell>
                <TableCell className="border border-black">{row.totalSpend}</TableCell>
                <TableCell className="border border-black">{row.purchaseRequestCount}</TableCell>
                <TableCell className="border border-black">{row.officeQuotationsCount}</TableCell>
                <TableCell className="border border-black">{row.supplierQuotationsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-2 mt-4 border-t border-black">
          <div className="p-2 border-r border-black">
            <span className="font-bold">Prepared By: </span>
            <span>{preparedBy}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}