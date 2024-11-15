'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, TrendingDown, TrendingUp, DollarSign, ShoppingCart, AlertTriangle, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const spendingData = [
  { month: "Jan", direct: 150000, indirect: 80000 },
  { month: "Feb", direct: 180000, indirect: 90000 },
  { month: "Mar", direct: 120000, indirect: 150000 },
  { month: "Apr", direct: 120000, indirect: 95000 },
  { month: "May", direct: 150000, indirect: 200000 },
  { month: "Jun", direct: 220000, indirect: 110000 },
  { month: "July", direct: 120000, indirect: 110000 },
  { month: "Aug", direct: 110000, indirect: 220000 },
]

const chartConfig: ChartConfig = {
  direct: {
    label: "Direct Spend",
    color: "hsl(var(--primary))",
  },
  indirect: {
    label: "Indirect Spend",
    color: "hsl(var(--danger))",
  },
}

const topOffices = [
  { name: "CETC", spend: 520000, avatar: "/cetc-logo.png?height=32&width=32" },
  { name: "CAS", spend: 480000, avatar: "/cas-logo.png?height=32&width=32" },
  { name: "CTED", spend: 450000, avatar: "/cted-logo.png?height=32&width=32" },
]

const recentPurchaseOrders = [
  { id: "001-25", supplier: "CETC", amount: 150000, status: "Approved" },
  { id: "002-25", supplier: "CAS", amount: 125000, status: "Pending" },
  { id: "003-25", supplier: "CTED", amount: 120000, status: "In Review" },
  { id: "004-25", supplier: "CBPA", amount: 100000, status: "Approved" },
]

export default function ProcurementDashboard() {
  const [period, setPeriod] = useState("thisMonth")

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your procurement activities</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
        <StatsCard
          title="Total Spend"
          value="₱1,230,500"
          change="+8.2%"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Purchase Requests"
          value="324"
          change="+12"
          trend="up"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Open Purchase Orders"
          value="57"
          change="-3"
          trend="down"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg. Order Processing Time"
          value="2.3 days"
          change="-0.5 days"
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-2 lg:grid-cols-7">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
                <Select defaultValue="direct">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Spending type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Spend</SelectItem>
                    <SelectItem value="indirect">Indirect Spend</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <TabsContent value="bar">
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="direct" fill="var(--color-direct)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="indirect" fill="var(--color-indirect)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="line">
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="direct" stroke="var(--color-direct)" strokeWidth={2} />
                      <Line type="monotone" dataKey="indirect" stroke="var(--color-indirect)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-8">
      <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>Top Offices</CardTitle>
            <CardDescription>By spend {period}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topOffices.map((supplier, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={supplier.avatar} alt={supplier.name} />
                    <AvatarFallback>{supplier.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{supplier.name}</p>
                    <p className="text-sm text-muted-foreground">₱{supplier.spend.toLocaleString()}</p>
                  </div>
                  <div className="ml-auto font-medium">#{index + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 lg:col-span-12">
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR No</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>{po.id}</TableCell>
                    <TableCell>{po.supplier}</TableCell>
                    <TableCell>₱{po.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full ml-4 px-2 py-1 text-xs font-medium ${
                        po.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        po.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {po.status === 'Approved' && <Check className="mr-1 h-3 w-3" />}
                        {po.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                        {po.status === 'In Review' && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {po.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, change, trend, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend === 'up' ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
          {change}
        </p>
      </CardContent>
    </Card>
  )
}