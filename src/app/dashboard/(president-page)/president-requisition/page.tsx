import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { FileText } from "lucide-react";

export default function PresidentRequisitionPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md w-[1200px]">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <span className="font-bold">Requisition</span>
        </div>
        <p className="text-sm text-white mt-2">
          This is the list of Requisitions that have been submitted and are awaiting approval from President
        </p>
      </h1>
      <DataTable columns={columns} />
    </div>
  );
};