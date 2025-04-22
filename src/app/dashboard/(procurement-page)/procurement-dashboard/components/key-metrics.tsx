'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Gauge, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


interface MetricsData {
  purchaseOrderCount: number;
  purchaseRequestCount: number;
  officeQuotationsCount: number;
  supplierQuotationsCount: number;
  pendingPurchaseRequestCount: number;
  approvedPurchaseRequestCount: number;
  rejectedPurchaseRequestCount: number;
  pendingPurchaseOrderCount: number;
  approvedPurchaseOrderCount: number;
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
    if (!period) return;
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Format the data for display
      interface ReportItem {
        prno: string;
        requestDate: string;
        overallTotal: number;
        date: string;
        winningBidder: string;
        winningTotal: number;
      }

      interface FormattedReportItem {
        prno: string;
        requestDate: string;
        totalAmount: string;
        date: string;
        winningBidder: string;
        winningTotal: string;
      }

      const formattedData = data.data.map((item: ReportItem) => ({
        prno: item.prno,
        requestDate: new Date(item.requestDate).toLocaleDateString(),
        totalAmount: formatCurrency(item.overallTotal),
        date: new Date(item.date).toLocaleDateString(),
        winningBidder: item.winningBidder,
        winningTotal: item.winningTotal ? formatCurrency(item.winningTotal) : "Not selected"
      }));

      // Show success message with first few records
      const sampleRecords = formattedData.slice(0, 3);
      const recordsText = sampleRecords.map((record: FormattedReportItem) => `
        PR No: ${record.prno}, 
        Request Date: ${record.requestDate}, 
        Total: ${record.totalAmount}, 
        Winning Bidder: ${record.winningBidder},
        Winning Total: ${record.winningTotal}
      `).join('\n');

      toast({
        title: "Report Generated Successfully!",
        description: `Generated ${formattedData.length} records. Sample records:\n${recordsText}`,
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
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
          title="Purchase Orders"
          value={metrics ? metrics.purchaseOrderCount.toString() : "Loading..."}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Purchase Orders"
          value={metrics ? metrics.pendingPurchaseOrderCount.toString() : "Loading..."}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Approved Purchase Orders"
          value={metrics ? metrics.approvedPurchaseOrderCount.toString() : "Loading..."}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Offices Quotations"
          value={metrics ? metrics.officeQuotationsCount.toString() : "Loading..."}
          icon={<FileText className="h-4 w-4" />}
        />

        <StatsCard
          title="Purchase Requests"
          value={metrics ? metrics.purchaseRequestCount.toString() : "Loading..."}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Purchase Requests"
          value={metrics ? metrics.pendingPurchaseRequestCount.toString() : "Loading..."}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Approved Purchase Requests"
          value={metrics ? metrics.approvedPurchaseRequestCount.toString() : "Loading..."}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Rejected Purchase Requests"
          value={metrics ? metrics.rejectedPurchaseRequestCount.toString() : "Loading..."}
          icon={<XCircle className="h-4 w-4" />}
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
                  <XAxis 
                    dataKey="month" 
                    stroke="red-950" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="red-950" 
                    tickFormatter={(value) => `${value.toLocaleString()}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="red-950" />
                  <Tooltip 
                    formatter={(value) => `${value.toLocaleString()}`}
                    labelFormatter={(label) => label}
                  />
                  <Bar 
                    dataKey="totalExpenses" 
                    fill="red-950" 
                    radius={[4, 4, 0, 0]} 
                    name="Total Expenses"
                  />
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
