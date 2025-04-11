import { DataTable } from "./components/data-table";
import { FileText } from "lucide-react";

export default function AbstractOfBidsPage() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <span className="font-bold">Abstract of Bids</span>
        </div>
        <p className="text-sm text-white mt-2">
          List of Abstract of Bids that are ready to print
        </p>
      </h1>
      <DataTable initialData={[]} />
    </div>
  );
}
