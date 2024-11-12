import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function RequisitionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold m-6">Requisition Page</h1>
      <DataTable columns={columns} />
    </div>
  );
}
