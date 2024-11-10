"use client";

import { useState, useEffect } from "react";
import { RequisitionDataTable } from "./data-table";
import { RequisitionTableColumn } from "./types";

export default function RequisitionTableWrapper() {

    const [data, setData] = useState<RequisitionTableColumn[]>([]);

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

    return <RequisitionDataTable data={data} setData={setData} />;
}
