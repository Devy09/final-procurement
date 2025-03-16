import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { FileText } from "lucide-react";

export default function OfficesQuotationPage() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <span className="font-bold">Offices Quotation</span>
        </div>
        <p className="text-sm text-white mt-2">
          List of Offices Quotation that are ready to canvass
        </p>
      </h1>
      <DataTable columns={columns} />
    </div>
  );
}
