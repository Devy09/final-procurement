import { Metadata } from "next";
import { DataTable } from "./components/data-table";
import { Package } from "lucide-react";
import { columns } from "./components/columns";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Supplier Quotations",
  description: "Manage supplier quotations",
};

async function getSupplierQuotations() {
  const quotations = await prisma.supplierQuotation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return quotations;
}

export default async function SupplierQuotationsPage() {
  const quotations = await getSupplierQuotations();

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <span className="font-bold">Supplier Quotations</span>
        </div>
        <p className="text-sm text-white mt-2">
          This is the list of Quotations that have been submitted by suppliers
        </p>
      </h1>
      <DataTable columns={columns} data={quotations} />
    </div>
  );
}