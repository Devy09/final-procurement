"use client";

import React, { useState, useEffect } from "react";
import { User, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Loader2 } from 'lucide-react'


async function fetchUserData(): Promise<User[]> {
  try {
    const response = await fetch("/api/user-manage")
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default function UserManagementPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const fetchedData = await fetchUserData();
      if (fetchedData.length === 0) {
        setError("No data available");
      } else {
        setData(fetchedData);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 ml-4">User Management</h1>
      {loading && <Loader2 className="animate-spin" />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
