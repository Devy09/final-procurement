"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export function ReportViewDialog({ report }: { report: any }) {
  const [open, setOpen] = useState(false);

  // Format date for display
  const formatDate = (date: string | null | undefined, isTableDate = false) => {
    if (!date) return "-";
    
    // If it's a table date, return it as is since it's already formatted
    if (isTableDate) return date;
    
    // For report creation date, format it properly
    const parsedDate = new Date(date);
    return parsedDate.toString() === "Invalid Date" ? "-" : format(parsedDate, "MMMM d, yyyy");
  };

  // Format currency
  const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) return "₱0.00";
    return amount;
  };

  return (
    <>
      <Button variant="outline" className="bg-red-950 text-white" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4" /> View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              <div className="text-2xl font-bold text-red-950">Procurement Monitoring Report</div>
            </DialogTitle>
            <Card className="w-full border-0 shadow-none">
              <CardHeader className="p-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600">
                    Date: <span className="font-semibold">{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <div className="py-6 border-y border-gray-200 px-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <img src="/transcsu.png" alt="School Logo" width={50} height={50} className="object-contain" />
                    <h2 className="text-xl font-bold text-red-500">Cotabato State University</h2>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sinsuat Avenue, Cotabato City</p>
                    <p className="text-sm text-gray-600">Telefax: (064) 421-5146</p>
                  </div>
                </div>

                <div className="text-center py-1 border-b border-black font-semibold">PROCUREMENT ACTIVITY REPORT</div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="border-collapse w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          PR NO.
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          PR DATE
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          AMOUNT
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          REQUESTING OFFICE
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          DATE OPENED
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          WINNING SUPPLIER
                        </TableHead>
                        <TableHead className="bg-red-950 font-bold border border-black text-center text-white">
                          PO AMOUNT
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.data.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="border border-black text-center">{item.prno || "-"}</TableCell>
                          <TableCell className="border border-black text-center">{formatDate(item.requestDate, true)}</TableCell>
                          <TableCell className="border border-black text-right">{item.overallTotal}</TableCell>
                          <TableCell className="border border-black text-center">{item.section || "-"}</TableCell>
                          <TableCell className="border border-black text-center">{formatDate(item.date, true)}</TableCell>
                          <TableCell className="border border-black text-center">{item.winningBidder || "Not selected"}</TableCell>
                          <TableCell className="border border-black text-right">{item.winningTotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-3 mt-8 gap-4 px-4">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 mb-10">Prepared by:</div>
                    <Separator className="w-48 border-black" />
                    <div className="font-semibold mt-1">{report.createdBy || "-"}</div>
                    <div className="text-sm text-gray-600">Procurement Officer</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 mb-10">Recommend for Approval by:</div>
                    <Separator className="w-48 border-black" />
                    <div className="font-semibold mt-1">CSU Procurement Office</div>
                    <div className="text-sm text-gray-600">Procurement Committee</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 mb-10">Approved by:</div>
                    <Separator className="w-48 border-black" />
                    <div className="font-semibold mt-1">CSU President</div>
                    <div className="text-sm text-gray-600">President</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}