'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Gauge, FileText, HandCoins, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


interface MetricsData {
  totalSpend: number;
  purchaseRequestCount: number;
  officeQuotationsCount: number;
  supplierQuotationsCount: number;
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
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/key-metrics/officer-metrics?period=${period}`);
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    }
    fetchMetrics();
  }, [period]);
  

  async function handleGenerateReport() {
    if (!metrics) return;
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalSpend: metrics.totalSpend,
          purchaseRequestCount: metrics.purchaseRequestCount,
          officeQuotationsCount: metrics.officeQuotationsCount,
          supplierQuotationsCount: metrics.supplierQuotationsCount,
          period: "thisMonth",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save report: ${response.statusText}`);
      }
  
      toast({
        title: "Success",
        description: "Report Generated successfully!",
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  }
  
  

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col bg-red-950 text-white p-4 rounded-lg w-full">
          <div className="flex items-center gap-2 text-2xl">
            <Gauge className="h-6 w-6" />
            <span className="font-bold">Procurement Dashboard</span>
          </div>
          <p className="text-muted-foreground text-sm text-white">Monitor and manage your procurement activities</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className='bg-red-950 text-white' onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Saving..." : "Generate Report"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
        <StatsCard
          title="Expenditure"
          value={metrics ? formatCurrency(metrics.totalSpend) : "Loading..."}
          icon={<HandCoins className="h-4 w-4" />}
        />
        <StatsCard
          title="Purchase Requests"
          value={metrics ? metrics.purchaseRequestCount.toString() : "Loading..."}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Offices Quotations"
          value={metrics ? metrics.officeQuotationsCount.toString() : "Loading..."}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Supplier Quotations"
          value={metrics ? metrics.supplierQuotationsCount.toString() : "Loading..."}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-2 lg:grid-cols-7">
        <Card className="w-[1200px]">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.spendingData || []}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="totalExpenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
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
