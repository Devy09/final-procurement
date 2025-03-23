"use client";

import React, { useEffect } from "react";

interface PurchaseRequestProps {
  data: {
    prNo: string;
    date: string;
    department: string;
    section: string;
    saino: string;
    alobsno: string;
    purpose: string;
    items: Array<{
      id?: string;
      itemNo: number;
      quantity: number;
      unit: string;
      description: string;
      stockNo: string | null;
      unitCost: string;
      totalCost: string;
    }>;
    overallTotal: string;
    createdBy: {
      name: string;
      designation: string;
      title: string;
      signatureUrl: string;
      createdAt: string;
    };
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

export default function PurchaseRequestPage({ data }: PurchaseRequestProps) {

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
        PURCHASE REQUEST
      </h2>

      {/* Form Details */}
      <div className="border border-black">
        <table className="w-full">
          <tbody className="text-black dark:text-black text-xs font-bold">
            <tr>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                Department:
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                {data.department}
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                PR No.:
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                {data.prNo}
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                Date:
              </td>
              <td className="border-b border-black p-1.5 w-1/6">
                {new Date(data.date).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                Section:
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                {data.section}
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                SAI No.:
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                {data.saino || ""}
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                Date:
              </td>
              <td className="border-b border-black p-1.5"></td>
            </tr>
            <tr>
              <td colSpan={2} className="border-b border-r border-black"></td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                ALOBS No.:
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                {data.alobsno || ""}
              </td>
              <td className="border-b border-r border-black p-1.5 w-1/6">
                Date:
              </td>
              <td className="border-b border-black p-1.5"></td>
            </tr>
            <tr>
              <td
                colSpan={6}
                className="border-b bg-customGreen border-black p-1.5"
              ></td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table className="w-full">
          <thead>
            <tr className="text-black dark:text-black text-xs">
              <th className="border-b border-r border-black p-1.5 w-14">
                Item #
              </th>
              <th className="border-b border-r border-black p-1.5 w-14">QTY</th>
              <th className="border-b border-r border-black p-1.5 w-14">
                Unit
              </th>
              <th className="border-b border-r border-black p-1.5">
                Item Description
              </th>
              <th className="border-b border-r border-black p-1.5 w-14">
                Stock No.
              </th>
              <th className="border-b border-r border-black p-1.5 w-28">
                Estimated Unit Cost
              </th>
              <th className="border-b border-black p-1.5 w-28">
                Estimated Total Cost
              </th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-black text-xs">
            {data.items.map((item) => (
              <tr key={item.id || item.itemNo}>
                <td className="border-b border-r border-black p-1.5 text-center">
                  {item.itemNo}
                </td>
                <td className="border-b border-r border-black p-1.5 text-center">
                  {item.quantity}
                </td>
                <td className="border-b border-r border-black p-1.5 text-center">
                  {item.unit}
                </td>
                <td className="border-b border-r border-black p-1.5">
                  {item.description}
                </td>
                <td className="border-b border-r border-black p-1.5 text-center">
                  {item.stockNo || ""}
                </td>
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
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 font-bold">
                **Nothing Follows**
              </td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 w-28"></td>
              <td className="border-b border-black p-1.5 w-28"></td>
            </tr>
            <tr className="bg-orange-100">
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td className="border-b border-r border-black p-1.5 font-bold text-right">
                TOTAL
              </td>
              <td className="border-b border-r border-black p-1.5 w-14"></td>
              <td
                colSpan={2}
                className="border-b border-black p-1.5 w-28 text-right font-bold"
              >
                ₱
                {parseFloat(data.overallTotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border-b border-r border-black p-1.5 font-bold text-center"
              >
                PURPOSE:
              </td>
              <td colSpan={5} className="border-b border-black p-1.5">
                {data.purpose}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full">
          <tbody className="text-black dark:text-black text-xs">
            <tr>
              <td className="border-b border-r border-black p-1.5 w-28"></td>
              <td className="border-b border-r border-black p-1.5 font-bold">
                Certified by:
              </td>
              <td className="border-b border-r border-black p-1.5 font-bold">
                Funds Available:
              </td>
              <td className="border-b border-black p-1.5 font-bold">
                Approved by:
              </td>
            </tr>
            <tr>
              <td className="border-b border-r border-black p-1.5 font-bold">
                Signature
              </td>
              <td className="border-b border-r border-black p-1.5 relative">
                {data.createdBy.signatureUrl && (
                  <img
                    src={data.createdBy.signatureUrl}
                    alt="Signature"
                    className="absolute top-[-20px] left-1/2 -translate-x-1/2 h-16 w-auto"
                  />
                )}
              </td>
              <td className="border-b border-r border-black p-1.5 relative">
                {data.accountantSignatureUrl && (
                  <img
                    src={data.accountantSignatureUrl}
                    alt="Signature"
                    className="absolute top-[-20px] left-1/2 -translate-x-1/2 h-16 w-auto"
                  />
                )}
              </td>
              <td className="border-b border-black p-1.5 relative">
                {data.presidentSignatureUrl && (
                  <img
                    src={data.presidentSignatureUrl}
                    alt="Signature"
                    className="absolute top-[-20px] left-1/2 -translate-x-1/2 h-16 w-auto"
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="border-b border-r border-black p-1.5 font-bold">
                Printed Name:
              </td>
              <td className="border-b border-r border-black p-1.5 text-center font-bold">
                {data.createdBy.name}, {data.createdBy.title}
              </td>
              <td className="border-b border-r border-black p-1.5 text-center font-bold">
                {data.accountantName}, {data.accountantTitle}
              </td>
              <td className="border-b border-black p-1.5 text-center font-bold">
                {data.presidentName}, {data.presidentTitle}
              </td>
            </tr>
            <tr>
              <td className="border-r border-black p-1.5 font-bold">
                Designation:
              </td>
              <td className="border-r border-black p-1.5 text-center">
                {data.createdBy.designation}
              </td>
              <td className="border-r border-black p-1.5 text-center">
                {data.accountantDesignation}
              </td>
              <td className="border-black p-1.5 text-center">
                {data.presidentDesignation}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
