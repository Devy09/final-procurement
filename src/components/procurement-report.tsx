import React from "react";
import { format } from "date-fns";

interface ProcurementReportProps {
  data?: {
    prNo?: string;
    date?: string;
    items?: Array<{
      itemNo: number;
      quantity: number;
      unit: string;
      description: string;
    }>;
  };
}

export default function ProcurementReport({ data }: ProcurementReportProps) {
  console.log("Procurement Report received data:", data);

  return (
    <div className="w-[21cm] min-h-[29.7cm] mx-auto p-8 bg-white text-black">
      <div className="flex items-start justify-start mb-6 gap-2 pl-[100px]">
        <img
          src="/transcsu.png"
          alt="University Logo"
          width={100}
          height={100}
          className="object-contain print:!block"
        />
        <div className="text-center">
          <p className="text-sm">Republic of the Philippines</p>
          <h1 className="font-bold text-xl" style={{ color: "#CC0000" }}>
            COTABATO STATE UNIVERSITY
          </h1>
          <p className="text-sm">Sinsuat Avenue, Cotabato City</p>
          <p className="text-sm">Telefax: (064) 421-5146</p>
          <a
            href="http://www.ccspc.edu.ph"
            className="text-sm text-blue-600 underline"
          >
            www.ccspc.edu.ph
          </a>
        </div>
      </div>

      <h2 className="text-center font-bold text-base mb-6 ml-18">
        PROCUREMENT REPORT
      </h2>

      <table className="w-full border-collapse border border-black mb-4 text-sm">
        <thead>
          <tr>
            <th
              className="border border-black p-1.5 w-16 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              Item#
            </th>
            <th
              className="border border-black p-1.5 w-16 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              QTY
            </th>
            <th
              className="border border-black p-1.5 w-16 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              Unit
            </th>
            <th
              className="border border-black p-1.5 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              Item Description
            </th>
            <th
              className="border border-black p-1.5 w-24 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              Unit Cost
            </th>
            <th
              className="border border-black p-1.5 w-24 text-xs"
              style={{ backgroundColor: "#ACDF87" }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.items ? (
            data.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5 text-center text-xs">
                  {item.itemNo}
                </td>
                <td className="border border-black p-1.5 text-center text-xs">
                  {item.quantity}
                </td>
                <td className="border border-black p-1.5 text-center text-xs">
                  {item.unit}
                </td>
                <td className="border border-black p-1.5 text-xs">
                  {item.description}
                </td>
                <td className="border border-black p-1.5 text-xs"></td>
                <td className="border border-black p-1.5 text-xs"></td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-black text-xs"
                colSpan={6}
                height="100"
              ></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
