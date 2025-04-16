"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { CommitteesTableColumn } from "./types";

export default function CommitteesTableWrapper() {
  const [data, setData] = useState<CommitteesTableColumn[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/committees");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching committees data:", error);
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
