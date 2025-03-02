"use client";

import React, { useState, useEffect } from "react";
import { User, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Loader2, UserRoundPlus } from 'lucide-react'


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
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md w-[1200px]">
        <div className="flex items-center gap-2">
          <UserRoundPlus className="w-6 h-6" />
          <span className="font-bold">User Management</span>
        </div>
        <p className="text-sm text-white mt-2">
          List of all users in the procurement management system
        </p>
      </h1>
      {loading && <Loader2 className="animate-spin" />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
