import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 text-gray-800 animate-spin" />
      <p className="ml-4 text-lg text-gray-600">Loading, please wait...</p>
    </div>
  );
}
