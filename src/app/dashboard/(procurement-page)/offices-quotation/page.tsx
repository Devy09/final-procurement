import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function OfficesQuotationPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold m-6">Offices Quotation Page</h1>
      <DataTable columns={columns} />
    </div>
  );
}
