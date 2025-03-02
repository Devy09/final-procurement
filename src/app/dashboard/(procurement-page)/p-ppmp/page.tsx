import PPMPTableWrapper from "./components/ppmp-tablewrapper";
import { Package } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md w-full">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <span className="font-bold">Project Procurement Management Plan</span>
        </div>
        <p className="text-sm text-white mt-2">
          This is the list of PPMP that has been approved by the Accountant
        </p>
      </h1>
      <PPMPTableWrapper />
    </div>
  );
}
