"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { PPMPTableColumn } from "./types";

export default function PPMPTableWrapper() {
  const [data, setData] = useState<PPMPTableColumn[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/ppmp");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching PPMP data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <DataTable data={data} setData={setData} />
    </div>
  );
}
