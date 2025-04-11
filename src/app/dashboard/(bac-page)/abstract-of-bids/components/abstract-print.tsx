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
          }
        `}
      </style>
      <div className="print-container p-4">
        <div className="w-full">
          <div className="flex items-center justify-center gap-4">
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
          <h4 className="text-black">
            <u>Date and Time Opened: {formatDateWithTime(data.date)}</u>
          </h4>
          <h2 className="text-black">
            <u>PR No. {data.prNo} dated: {formatDate(data.requestDate)}</u>
          </h2>
          <h4 className="text-black mb-4">
            <u>ABC = ₱{parseFloat(data.overallTotal).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</u>
          </h4>
        </div>
        <div className="border border-black">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  colSpan={3}
                  rowSpan={2}
                  className="border-r border-b border-black text-center p-1 text-xs text-black"
                >
                  Items
                </TableHead>
                <TableHead
                  rowSpan={3}
                  className="border-r border-b border-black text-center p-1 text-xs text-black"
                >
                  Description of Articles
                </TableHead>
                <TableHead
                  colSpan={supplierData.length * 2}
                  className="border-b border-black customFont text-center p-1 text-xs text-black"
                >
                  Name of Bidders
                </TableHead>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                {supplierData.map((supplier) => (
                  <TableHead
                    key={supplier.name}
                    colSpan={2}
                    className="border-b border-r border-black text-center p-1 text-xs text-black"
                  >
                    {supplier.name}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableHead className="border-r border-b border-black p-1 text-xs text-black text-center">
                  Item#
                </TableHead>
                <TableHead className="border-r border-b border-black p-1 text-xs text-black text-center">
                  Qty
                </TableHead>
                <TableHead className="border-r border-b border-black p-1 text-xs text-black text-center">
                  Unit
                </TableHead>
                {supplierData.map((supplier) => (
                  <React.Fragment key={supplier.name}>
                    <TableHead className="border-r border-b border-black text-right p-1 text-xs text-black">
                      Unit Cost
                    </TableHead>
                    <TableHead className="border-r border-b border-black text-right p-1 text-xs text-black">
                      Total
                    </TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.itemNo} className="hover:bg-transparent">
                  <TableCell className="border-r border-b border-black p-1 text-xs text-black text-center">
                    {item.itemNo}
                  </TableCell>
                  <TableCell className="border-r border-b border-black p-1 text-xs text-black text-center">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="border-r border-b border-black p-1 text-xs text-black text-center">
                    {item.unit}
                  </TableCell>
                  <TableCell className="border-r border-b border-black p-1 text-xs text-black">
                    {item.description}
                  </TableCell>
                  {supplierData.map((supplier) => {
                    const bid = supplier.bids.find(
                      (b: any) => b.itemNo === item.itemNo
                    );

                    return (
                      <React.Fragment key={supplier.name}>
                        <TableCell className="border-r border-b border-black text-right p-1 text-xs text-black">
                          {bid ? `₱${bid.unitCost.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="border-r border-b border-black text-right p-1 text-xs text-black">
                          {bid ? `₱${bid.total.toLocaleString()}` : "-"}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow className="font-bold hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="border-r border-black p-1 text-xs text-center text-black"
                >
                  TOTAL
                </TableCell>
                {supplierData.map((supplier) => (
                  <React.Fragment key={supplier.name}>
                    <TableCell className="border-r border-black text-right p-1 text-xs text-black">
                      -
                    </TableCell>
                    <TableCell className="border-r border-black text-right p-1 text-xs text-black">
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

        <div className="mt-4">
          <h3 className="text-md text-black mb-4">
            Award recommended to:{" "}
            <b>
              <u>{data.winningBidder || "Not selected"}</u>
            </b>{" "}
            as the Lowest Calculated and Responsive Bid.
          </h3>
        </div>
        <div className="mt-2">
          <h3 className="text-md text-black mb-4">
            CSU Bids and Awards Committee:
          </h3>
        </div>
      </div>
    </div>
  );
}
