"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AbstractPrintProps {
  data: {
    prNo: string;
    requestDate: string;
    date: string;
    items: {
      itemNo: number;
      description: string;
      quantity: number;
      unit: string;
      bids: {
        [key: string]: {
          total: number;
          unitCost: number;
        };
      };
    }[];
    overallTotal: string;
    winningBidder: string | null;
    committees: {
      name: string;
      title: string;
      designation: string;
    }[];
  };
}

export function AbstractPrint({ data }: AbstractPrintProps) {
  // Get unique bidders from the bids object keys
  const bidders = Array.from(
    new Set(
      data.items.flatMap((item) => (item.bids ? Object.keys(item.bids) : []))
    )
  ).sort();

  console.log("Unique bidders:", bidders);

  // Get supplier data for each bidder
  const supplierData = bidders.map((bidder) => {
    const supplierBids = data.items.flatMap((item) =>
      item.bids && item.bids[bidder]
        ? [
            {
              supplierName: bidder,
              itemNo: item.itemNo,
              unitCost: item.bids[bidder].unitCost,
              total: item.bids[bidder].total,
            },
          ]
        : []
    );

    const total = supplierBids.reduce((sum: number, bid: any) => {
      return sum + bid.total;
    }, 0);

    console.log(`Supplier data for ${bidder}:`, {
      name: bidder,
      bids: supplierBids,
      total,
    });

    return {
      name: bidder,
      bids: supplierBids,
      total,
    };
  });

  console.log("Final supplier data:", supplierData);

  // Add date formatting functions
  function formatDateWithTime(dateString: string): string {
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "2-digit",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", dateOptions)} @ ${date.toLocaleTimeString(
      "en-US",
      timeOptions
    )}`;
  }

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  return (
    <div className="w-full h-full bg-white text-black">
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-container {
              width: 100%;
              height: 100%;
              font-family: Times New Roman, serif !important;
            }
            .print-container * {
              font-family: inherit !important;
            }
            .table-container {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .table-header {
              break-after: avoid;
              page-break-after: avoid;
            }
            .table-body {
              break-inside: auto;
              page-break-inside: auto;
            }
            .table-row {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      <div className="print-container p-4">
        <div className="w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <img
                src="/transcsu.png"
                alt="University Logo"
                width={100}
                height={100}
                className="object-contain print:!block"
              />
              <div className="text-center">
                <p className="text-xs">Republic of the Philippines</p>
                <h4 className="font-bold text-lg" style={{ color: "#CC0000" }}>
                  COTABATO STATE UNIVERSITY
                </h4>
                <h2 className="font-bold text-xl" style={{ color: "#0284c7" }}>
                  BIDS AND AWARDS COMMITTEE
                </h2>
                <p className="text-xs">Sinsuat Avenue, RH-4, Cotabato City</p>
              </div>
            </div>
          </div>
          <h5 className="text-black text-sm">
            <u>Date and Time Opened: {formatDateWithTime(data.date)}</u>
          </h5>
          <h5 className="text-black text-sm">
            <u>PR No. {data.prNo} dated: {formatDate(data.requestDate)}</u>
          </h5>
          <h4 className="text-black mb-4 text-sm">
            <u>ABC = ₱{parseFloat(data.overallTotal).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</u>
          </h4>
        </div>
        <div className="border border-black">
          <div className="table-container">
            <Table>
              <TableHeader className="table-header">
                <TableRow className="table-row hover:bg-transparent">
                  <TableHead
                    colSpan={3}
                    rowSpan={2}
                    className="border-r border-b border-black text-center p-0.5 h-6 text-[10px] text-black"
                  >
                    Items
                  </TableHead>
                  <TableHead
                    rowSpan={3}
                    className="border-r border-b border-black text-center p-0.5 h-6 text-[10px] text-black"
                  >
                    Description of Articles
                  </TableHead>
                  <TableHead
                    colSpan={supplierData.length * 2}
                    className="border-b border-black text-center p-0.5 h-6 text-[10px] text-black"
                  >
                    Name of Bidders
                  </TableHead>
                </TableRow>
                <TableRow className="table-row hover:bg-transparent">
                  {supplierData.map((supplier) => (
                    <TableHead
                      key={supplier.name}
                      colSpan={2}
                      className="border-b border-r border-black text-center p-0.5 h-6 text-[10px] text-black"
                    >
                      {supplier.name}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow className="table-row hover:bg-transparent">
                  <TableHead className="border-r border-b border-black text-center p-0.5 h-6 text-[10px] text-black">
                    Item#
                  </TableHead>
                  <TableHead className="border-r border-b border-black text-center p-0.5 h-6 text-[10px] text-black">
                    Qty
                  </TableHead>
                  <TableHead className="border-r border-b border-black text-center p-0.5 h-6 text-[10px] text-black">
                    Unit
                  </TableHead>
                  {supplierData.map((supplier) => (
                    <React.Fragment key={supplier.name}>
                      <TableHead className="border-r border-b border-black text-right p-0.5 h-6 text-[10px] text-black">
                        Unit Cost
                      </TableHead>
                      <TableHead className="border-r border-b border-black text-right p-0.5 h-6 text-[10px] text-black">
                        Total
                      </TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="table-body">
                {data.items.map((item) => (
                  <TableRow key={item.itemNo} className="table-row hover:bg-transparent">
                    <TableCell className="border-r border-b border-black p-0.5 h-6 text-[10px] text-black text-center">
                      {item.itemNo}
                    </TableCell>
                    <TableCell className="border-r border-b border-black p-0.5 h-6 text-[10px] text-black text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="border-r border-b border-black p-0.5 h-6 text-[10px] text-black text-center">
                      {item.unit}
                    </TableCell>
                    <TableCell className="border-r border-b border-black p-0.5 h-6 text-[10px] text-black">
                      {item.description}
                    </TableCell>
                    {supplierData.map((supplier) => {
                      const bid = supplier.bids.find(
                        (b: any) => b.itemNo === item.itemNo
                      );

                      return (
                        <React.Fragment key={supplier.name}>
                          <TableCell className="border-r border-b border-black text-right p-0.5 h-6 text-[10px] text-black">
                            {bid ? `₱${bid.unitCost.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell className="border-r border-b border-black text-right p-0.5 h-6 text-[10px] text-black">
                            {bid ? `₱${bid.total.toLocaleString()}` : "-"}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow className="table-row font-bold hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="border-r border-black p-0.5 h-6 text-[10px] text-center text-black"
                  >
                    TOTAL
                  </TableCell>
                  {supplierData.map((supplier) => (
                    <React.Fragment key={supplier.name}>
                      <TableCell className="border-r border-black text-right p-0.5 h-6 text-[10px] text-black">
                        -
                      </TableCell>
                      <TableCell className="border-r border-black text-right p-0.5 h-6 text-[10px] text-black">
                        {supplier.total > 0
                          ? `₱${supplier.total.toLocaleString()}`
                          : "-"}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm text-black mb-2">
            Award recommended to:{" "}
            <b>
              <u>{data.winningBidder || "Not selected"}</u>
            </b>{" "}
            as the Lowest Calculated and Responsive Bid.
          </h3>
        </div>
        <div className="mt-2">
          <h3 className="text-sm text-black mb-4">
            CSU Bids and Awards Committee:
          </h3>
          <div className="columns-3">
            {data.committees.map((committee, index) => (
              <div key={index} className="column pr-4 pb-4">
                <div className="justify-start">
                  <p className="text-sm font-semibold">
                    {committee.name}, {committee.title}<br />
                  </p>
                  <p className="text-sm text-gray-600">
                    {committee.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <div className="w-64">
              <p className="text-sm">
                Approved:<br />
              </p>
              <p className="text-sm font-semibold">
                SEMA G. DILNA, EdD<br />
              </p>
              <p className="text-sm text-gray-600 mt-1">
                University President
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
