"use client";

import React from "react";
import { format } from "date-fns"

interface PurchaseOrderProps {
  data: {
    prNo: string;
    date: string;
    supplierName: string;
    items: Array<{
      id?: string;
      itemNo: number;
      quantity: number;
      unit: string;
      description: string;
      unitCost: string;
      totalCost: string;
    }>;
    overallTotal: string;
    accountantName: string;
    accountantTitle: string;
    accountantSignatureUrl: string;
    accountantDesignation: string;
    presidentName: string;
    presidentTitle: string;
    presidentSignatureUrl: string;
    presidentDesignation: string;
  };
}

export default function PurchaseOrderPage({ data }: PurchaseOrderProps) {
  return (
    <div
      className="print-container"
      style={{ maxWidth: "8.5in", margin: "0 auto" }}
    >
      <div className="flex items-start ml-[120px] mb-8 gap-4 mt-8">
        <img
          src="/transcsu.png"
          alt="University Logo"
          width={100}
          height={100}
          className="object-contain print:!block"
        />
        <div className="text-center">
          <p className="text-xs">Republic of the Philippines</p>
          <h1 className="font-bold text-xl" style={{ color: "#CC0000" }}>
            COTABATO STATE UNIVERSITY
          </h1>
          <p className="text-xs">Sinsuat Avenue, Cotabato City</p>
          <p className="text-xs">Telefax: (064) 421-5146</p>
          <a
            href="http://www.ccspc.edu.ph"
            className="text-xs text-blue-600 underline"
          >
            www.ccspc.edu.ph
          </a>
        </div>
      </div>

      <h2 className="text-center justify-center font-bold text-lg mb-4">
        PURCHASE ORDER
      </h2>

      {/* Header Text */}
      <div className="text-xs mb-6">
        <p>
          Account of <span className="font-bold">COTABATO STATE UNIVERSITY</span>, Cotabato City to{" "}
          <span className="font-bold">{data.supplierName}</span> Purchase Order
          No. {data.prNo} dated: {format(new Date(data.date), 'MMMM dd, yyyy')} and Purchase Request No.{" "}
          {data.prNo} dated: {format(new Date(data.date), 'MMMM dd, yyyy')}.
        </p>
        <p className="mt-2">
          Please deliver to <span className="font-bold">COTABATO STATE UNIVERSITY</span>, Cotabato City
          within Twenty-One (21) days after receipt of this order for the following articles at the
          price indicated based on your Bid Offer/quotation evaluated and duly approved by the Bids and
          Awards Committee.
        </p>
      </div>

      {/* Items Table */}
      <div className="border border-black">
        <table className="w-full">
          <thead>
            <tr className="text-black dark:text-black text-xs bg-gray-200">
              <th className="border-b border-r border-black p-1.5 w-14">Item</th>
              <th className="border-b border-r border-black p-1.5 w-14">Qty</th>
              <th className="border-b border-r border-black p-1.5 w-14">Unit</th>
              <th className="border-b border-r border-black p-1.5">DESCRIPTION OF ARTICLES</th>
              <th className="border-b border-r border-black p-1.5 w-28">Unit Price</th>
              <th className="border-b border-black p-1.5 w-28">Total</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-black text-xs">
            {data.items.map((item) => (
              <tr key={item.id || item.itemNo}>
                <td className="border-b border-r border-black p-1.5 text-center">{item.itemNo}</td>
                <td className="border-b border-r border-black p-1.5 text-center">{item.quantity}</td>
                <td className="border-b border-r border-black p-1.5 text-center">{item.unit}</td>
                <td className="border-b border-r border-black p-1.5">{item.description}</td>
                <td className="border-b border-r border-black p-1.5 text-right">
                  {parseFloat(item.unitCost).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="border-b border-black p-1.5 text-right">
                  {parseFloat(item.totalCost).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border-b border-r border-black p-1.5"></td>
              <td className="border-b border-r border-black p-1.5"></td>
              <td className="border-b border-r border-black p-1.5"></td>
              <td className="border-b border-r border-black p-1.5 font-bold">**Nothing Follows**</td>
              <td className="border-b border-r border-black p-1.5"></td>
              <td className="border-b border-black p-1.5"></td>
            </tr>
            <tr>
              <td className=" border-r border-black p-1.5"></td>
              <td className=" border-r border-black p-1.5"></td>
              <td className=" border-r border-black p-1.5"></td>
              <td className=" border-r border-black p-1.5 font-bold text-right">TOTAL</td>
              <td className=" border-r border-black p-1.5"></td>
              <td className=" border-black p-1.5 text-right font-bold">
                ₱{parseFloat(data.overallTotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Penalty Notice */}
      <div className="text-xs mt-4">
        <p>
          In case of failure to make full delivery within the time specified above, a penalty (liquidated damages) of one-tenth (1/10)
          or one percent of the total amount for every day of delay shall be imposed.
        </p>
      </div>

      {/* Signature Section */}
      <div className="mt-8">
        <div className="text-xs">
          <p>Funds Available:</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center -mt-10 relative">
              {data.accountantSignatureUrl && (
                <img 
                  src={data.accountantSignatureUrl} 
                  alt="Accountant Signature" 
                  className="absolute left-1/2 -translate-x-1/2 -top-4 h-24 w-auto" 
                />
              )}
              <div className="mt-20">
                <p className="font-bold uppercase">{data.accountantName}, {data.accountantTitle}</p>
                <p>{data.accountantDesignation}</p>
              </div>
            </div>
            <div className="text-center relative">
              {data.presidentSignatureUrl && (
                <img 
                  src={data.presidentSignatureUrl} 
                  alt="President Signature" 
                  className="absolute left-1/2 -translate-x-1/2 -top-4 h-24 w-auto" 
                />
              )}
              <div className="mt-20">
                <p className="font-bold uppercase">{data.presidentName}</p>
                <p>{data.presidentDesignation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs">
          <p className="mb-4">
            Received this Purchase Order on ______ day of ______________, 2024 and held myself bound by the terms and conditions of
            Contract and Order applicable rules / law.
          </p>
          <div className="text-right mt-16 mr-4">
            <p className="border-t border-black inline-block w-64">
              Signature over Printer Name of Supplier/Representative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
