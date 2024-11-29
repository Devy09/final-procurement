import { Metadata } from "next";
import { DataTable } from "./components/data-table";
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 ml-4">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Quotations</h1>
      </div>
      <DataTable columns={columns} data={quotations} />
    </div>
  );
}
