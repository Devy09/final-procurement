import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default function AccountantRequisitionPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold m-6">Requisition Page</h1>
      <DataTable columns={columns} />
    </div>
  );
};