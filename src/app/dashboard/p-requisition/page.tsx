import React from 'react'

import { ClipboardList, Hourglass, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const PRequisition = () => {
  return (
    <div className="h-screen p-8 flex flex-col gap-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-2">
          <div>
            <CardHeader>
              <CardTitle>
                Requisitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">232</p>
            </CardContent>
          </div>
          <ClipboardList size={40} className="text-blue-500" />
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">343</p>
            </CardContent>
          </div>
          <Hourglass size={35} className="text-yellow-500" />
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div>
            <CardHeader>
              <CardTitle>Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">231</p>
            </CardContent>
          </div>
          <CheckCircle size={40} className="text-green-500" />
        </Card>
      </div>

      <div className="flex justify-start">
        <Button>Create New Requisition</Button>
      </div>

      {/* Data Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PR No</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>001-25</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>CETC</TableCell>
              <TableCell>10-28-2024</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-yellow-500">
                  On going
                </Badge>
              </TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PRequisition;