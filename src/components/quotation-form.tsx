import React from 'react';
import Image from 'next/image';
import { format } from "date-fns";

interface QuotationFormProps {
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

export default function QuotationForm({ data }: QuotationFormProps) {
  return (
    <div className="w-[21cm] min-h-[29.7cm] mx-auto p-8 bg-white text-black">
      <div className="flex items-start justify-start mb-6 gap-2 pl-[100px]">
        <Image 
          src="/transcsu.png" 
          alt="University Logo" 
          width={100} 
          height={100}
          className="object-contain print:!block"
        />
        <div className="text-center">
          <p className="text-sm">Republic of the Philippines</p>
          <h1 className="font-bold text-xl" style={{ color: '#CC0000' }}>COTABATO STATE UNIVERSITY</h1>
          <p className="text-sm">Sinsuat Avenue, Cotabato City</p>
          <p className="text-sm">Telefax: (064) 421-5146</p>
          <a href="http://www.ccspc.edu.ph" 
             className="text-sm text-blue-600 underline">
            www.ccspc.edu.ph
          </a>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-right" style={{ marginRight: '40px' }}>
          PR No. <span className="ml-8">{data?.prNo || "018-24"}({data?.date ? format(new Date(data.date), "MM/dd/yyyy") : "02/22/2024"})</span>
        </p>
      </div>

      <h2 className="text-center font-bold text-base mb-6 ml-18">REQUEST FOR QUOTATION</h2>

      <div className="mb-4">
        <div className="border-b border-black w-48"></div>
        <p className="text-sm ml-10">Name of Supplier</p>
      </div>

      <p className="text-sm mb-2">Sir/Ma'am:</p>
      <p className="text-sm mb-4 ml-8">Please quote your lowest net price, taxes included on the following articles listed below:</p>

      <table className="w-full border-collapse border border-black mb-4 text-sm">
        <thead>
          <tr>
            <th className="border border-black p-1.5 w-16 text-xs" style={{ backgroundColor: '#ACDF87' }}>Item#</th>
            <th className="border border-black p-1.5 w-16 text-xs" style={{ backgroundColor: '#ACDF87' }}>QTY</th>
            <th className="border border-black p-1.5 w-16 text-xs" style={{ backgroundColor: '#ACDF87' }}>Unit</th>
            <th className="border border-black p-1.5 text-xs" style={{ backgroundColor: '#ACDF87' }}>Item Description</th>
            <th className="border border-black p-1.5 w-24 text-xs" style={{ backgroundColor: '#ACDF87' }}>Unit Cost</th>
            <th className="border border-black p-1.5 w-24 text-xs" style={{ backgroundColor: '#ACDF87' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data?.items ? (
            data.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5 text-center text-xs">{item.itemNo}</td>
                <td className="border border-black p-1.5 text-center text-xs">{item.quantity}</td>
                <td className="border border-black p-1.5 text-center text-xs">{item.unit}</td>
                <td className="border border-black p-1.5 text-xs">{item.description}</td>
                <td className="border border-black p-1.5 text-xs"></td>
                <td className="border border-black p-1.5 text-xs"></td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-black text-xs" colSpan={6} height="100"></td>
            </tr>
          )}
          <tr>
            <td className="border border-black p-1.5 text-center text-xs" colSpan={6}>***Nothing Follows***</td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-1 mb-4">
        <p className="text-xs text-red-600">***Please indicate your Brand Offer (if applicable) for each item (for evaluation purposes)***</p>
        <p className="text-xs text-red-600">***Payment processing is ten (10) to fifteen (15) days after full delivery, inspection and acceptance***</p>
        <p className="text-xs text-red-600">***Tax deductions applies for VAT and Non-VAT (2307)</p>
      </div>

      <p className="text-xs mb-6 text-justify">
        It is requested that you return this form in a sealed envelope by a messenger or mail it not later than ______________, 24___ at 
        __________________. Only one canvass should be placed in an envelope marked "BID PROPOSAL". Brochure may be attached in the canvass form. 
        A Purchase Order to the winning bidder shall be made immediately after the awarding. However, this office reserves the right to reject 
        any offer without specified quality herein contained.
      </p>

      <div className="flex justify-between mt-10">
        <div>
          <p className="text-xs">Quoted by:</p>
          <div className="mt-6 border-b border-black w-64"></div>
          <p className="text-xs">Name, Position & Signature of Representative</p>
          <p className="text-xs mt-2">
            Date: <span className="border-b border-black inline-block w-32 ml-1"></span>
          </p>
        </div>

        <div className="text-right mr-10">
          <p className="text-xs">Very truly yours,</p>
          <div className="mt-8 mb-1 border-b border-black inline-block w-32"></div>
          <p className="text-xs font-bold">SEMA G. DILNA, EdD</p>
          <p className="text-xs">University President</p>
        </div>
      </div>
    </div>
  );
}

