'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Package, Gauge, HandCoins, Clock, CheckCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

interface MetricsData {
  totalSpend: number;
  purchaseOrderCount: number;
  pendingCount: number;
  approvedCount: number;
  spendingData: SpendingData[];
}

interface SpendingData {
  month: string;
  totalExpenses: number;
}

const chartConfig: ChartConfig = {
  totalExpenses: {
    label: "Total Expenses",
    color: "hsl(var(--primary))",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ProcurementDashboard() {
  const [period, setPeriod] = useState("thisMonth");
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/key-metrics/office-head?period=${period}`);
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
  
        console.log("Fetched Metrics Data:", data);
  
        // Map directly to match API response
        setMetrics({
          totalSpend: parseFloat(data.totalSpend), // Ensure it's a number
          purchaseOrderCount: data.purchaseOrderCount,
          pendingCount: data.pendingCount,
          approvedCount: data.approvedCount,
          spendingData: data.spendingData || []
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    }
    fetchMetrics();
  }, [period]);
  
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col bg-red-950 text-white p-4 rounded-lg w-full">
          <div className="flex items-center gap-2 text-2xl">
            <Gauge className="h-6 w-6" />
            <span className="font-bold">President Dashboard</span>
          </div>
          <p className="text-muted-foreground text-sm text-white">Monitor and manage your procurement activities</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
        <StatsCard
          title="Total Expenditure"
          value={metrics ? formatCurrency(metrics.totalSpend) : "Loading..."}
          icon={<HandCoins className="h-4 w-4" />}
        />
        <StatsCard
          title="Purchase Orders"
          value={metrics ? metrics.purchaseOrderCount.toString() : "Loading..."}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Orders"
          value={metrics?.pendingCount !== undefined ? metrics.pendingCount.toString() : "0"}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Approved Orders"
          value={metrics?.approvedCount !== undefined ? metrics.approvedCount.toString() : "0"}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-2 lg:grid-cols-7">
        <Card className="col-span-full w-full">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.spendingData || []}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="totalExpenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-red-950 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
