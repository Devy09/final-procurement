import CommitteesTableWrapper from "./components/committees-tablewrapper";
import { Package } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <span className="font-bold">Bids and Awards Committees</span>
        </div>
        <p className="text-sm text-white mt-2">
          This is the list of Committees
        </p>
      </h1>
      <CommitteesTableWrapper />
    </div>
  );
}
