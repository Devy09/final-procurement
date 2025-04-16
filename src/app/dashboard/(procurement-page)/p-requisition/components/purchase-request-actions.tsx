"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ExternalLink,
  MoreHorizontal,
  Loader2,
  MapPin,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentTracker from "./document-tracker";
import PurchaseRequestPage from "@/components/requisition-print";

interface PurchaseRequestItem {
  id: string;
  itemNo: number;
  quantity: number;
  unit: string;
  description: string;
  stockNo: string | null;
  unitCost: string;
  totalCost: string;
}

interface PurchaseRequestDetails {
  id: string;
  prno: string;
  department: string;
  section: string;
  date: string;
  saino: string;
  alobsno: string;
  purpose: string;
  status: string;
  overallTotal: string;
  procurementMode: string;
  items: PurchaseRequestItem[];
  createdBy: {
    name: string;
    designation: string;
    createdAt: string;
    title: string;
    signatureUrl: string;
  };
  certificationFile: string;
  letterFile: string;
  proposalFile: string;
  accountantName: string;
  accountantTitle: string;
  accountantSignatureUrl: string;
  accountantDesignation: string;
  presidentName: string;
  presidentTitle: string;
  presidentSignatureUrl: string;
  presidentDesignation: string;
}

interface PurchaseRequestColumn {
  id: string;
}

interface PurchaseRequestActionsProps {
  requisition: PurchaseRequestColumn;
}

// Utility function to validate dates
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function PurchaseRequestActions({
  requisition,
}: PurchaseRequestActionsProps) {
  const [open, setOpen] = useState(false);
  const [prDetails, setPrDetails] = useState<PurchaseRequestDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (open || printOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/requisition-view/${requisition.id}`
          );

          console.error('Fetch Response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          console.error('Fetched Requisition Data:', JSON.stringify(data, null, 2));
          console.error('Specific Fields:', {
            createdBy: data.createdBy,
            accountantName: data.accountantName,
            accountantTitle: data.accountantTitle,
            accountantSignatureUrl: data.accountantSignatureUrl,
            presidentName: data.presidentName,
            presidentTitle: data.presidentTitle,
            presidentSignatureUrl: data.presidentSignatureUrl
          });

          setPrDetails(data);
        } catch (error) {
          console.error('Fetch Error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open, printOpen, requisition.id]);

  const renderAttachments = () => {
    if (!prDetails) return null;

    const attachments = [
      { label: "Certification", file: prDetails.certificationFile },
      { label: "Letter", file: prDetails.letterFile },
      { label: "Proposal", file: prDetails.proposalFile },
    ];

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Attachments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attachments.map((attachment, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <dt className="font-medium text-gray-500 mb-2">
                {attachment.label}
              </dt>
              <dd className="text-lg">
                {attachment.file ? (
                <a
                  href={attachment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-950 text-white px-2 py-1 rounded-md"
                >
                  View File
                </a>                              
                ) : (
                  <span className="text-gray-400">No file uploaded</span>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    setPrintOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTrackerOpen(true)}
            className="text-red-500"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Document Tracker
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint} className="text-blue-500">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Purchase Request Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : prDetails ? (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-red-950 text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        General Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              Department
                            </span>
                            <span className="text-lg">
                              {prDetails.department}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              Section
                            </span>
                            <span className="text-lg">{prDetails.section}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              PR No
                            </span>
                            <span className="text-lg">{prDetails.prno}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              Date
                            </span>
                            <span className="text-lg">
                              {isValidDate(prDetails.date)
                                ? format(new Date(prDetails.date), "PPP")
                                : "Invalid date"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              SAI No
                            </span>
                            <span className="text-lg">{prDetails.saino}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-200">
                              ALOBS No
                            </span>
                            <span className="text-lg">{prDetails.alobsno}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-100">
                              <TableHead className="font-semibold">
                                Item No
                              </TableHead>
                              <TableHead className="font-semibold">
                                Quantity
                              </TableHead>
                              <TableHead className="font-semibold">
                                Unit
                              </TableHead>
                              <TableHead className="font-semibold">
                                Description
                              </TableHead>
                              <TableHead className="font-semibold">
                                Stock No
                              </TableHead>
                              <TableHead className="font-semibold text-right">
                                Unit Cost
                              </TableHead>
                              <TableHead className="font-semibold text-right">
                                Total Cost
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prDetails.items.map((item) => (
                              <TableRow
                                key={item.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium">
                                  {item.itemNo}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.stockNo || "-"}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ₱
                                  {parseFloat(item.unitCost).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₱
                                  {parseFloat(item.totalCost).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-gray-50">
                              <TableCell
                                colSpan={6}
                                className="text-right font-semibold text-green-600"
                              >
                                Total Amount:
                              </TableCell>
                              <TableCell className="text-right font-bold text-green-600">
                                ₱
                                {parseFloat(
                                  prDetails.overallTotal
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Additional Information
                      </h3>
                      <dl className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-medium text-gray-500 mb-1">
                            Submitted by
                          </dt>
                          <dd className="text-lg">
                            {prDetails.createdBy.name},{prDetails.createdBy.title}
                            {prDetails.createdBy.designation}
                          </dd>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-medium text-gray-500 mb-1">
                            Procurement Mode
                          </dt>
                          <dd className="text-lg">
                            {prDetails.procurementMode}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    {renderAttachments()}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="max-w-[22cm] max-h-[95vh] dialog-content">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(95vh-8rem)]">
            <div className="print-container bg-white text-black">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : prDetails ? (
                <PurchaseRequestPage
                  data={{
                    prNo: prDetails.prno,
                    date: prDetails.date,
                    department: prDetails.department,
                    section: prDetails.section,
                    saino: prDetails.saino,
                    alobsno: prDetails.alobsno,
                    purpose: prDetails.purpose,
                    items: prDetails.items,
                    overallTotal: prDetails.overallTotal,
                    createdBy: prDetails.createdBy,
                    accountantName: prDetails.accountantName,
                    accountantTitle: prDetails.accountantTitle,
                    accountantSignatureUrl: prDetails.accountantSignatureUrl,
                    accountantDesignation: prDetails.accountantDesignation,
                    presidentName: prDetails.presidentName,
                    presidentTitle: prDetails.presidentTitle,
                    presidentSignatureUrl: prDetails.presidentSignatureUrl,
                    presidentDesignation: prDetails.presidentDesignation,
                  }}
                />
              ) : (
                <div className="text-center py-4">No data available</div>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-4 print:hidden">
            <Button
              onClick={() => setPrintOpen(false)}
              className="bg-red-950 text-white hover:bg-red-900"
            >
              Cancel
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-red-950 text-white hover:bg-red-900"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={trackerOpen} onOpenChange={setTrackerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Tracker</DialogTitle>
          </DialogHeader>
          <DocumentTracker purchaseRequestId={requisition.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
